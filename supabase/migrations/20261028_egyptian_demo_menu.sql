-- =============================================================================
-- Foodie — Egyptian demo menu
--
-- Run once in the Supabase SQL editor, after the earlier migrations.
-- Safe to re-run.
--
--   1. Categories become breakfast / sandwiches / grills / mains / sides /
--      desserts / drinks (must match PRODUCT_CATEGORIES in
--      src/types/ProductsTypes.ts). Existing burgers move to sandwiches,
--      pizza to mains.
--   2. The old demo menu is replaced by 16 Egyptian dishes. Old dishes that
--      appear in past orders are archived so order history keeps their name
--      and image; the rest are deleted. Dishes added from the dashboard are
--      left alone.
--
-- Photos are from Unsplash (free to use, no attribution required).
-- =============================================================================


-- 1. Categories ---------------------------------------------------------------

alter table public.products drop constraint if exists products_category_check;

update public.products set category = 'sandwiches' where category = 'burgers';
update public.products set category = 'mains' where category = 'pizza';

alter table public.products add constraint products_category_check
  check (category in ('breakfast', 'sandwiches', 'grills', 'mains', 'sides', 'desserts', 'drinks'));


-- 2. Demo menu ----------------------------------------------------------------

do $$
begin
  -- Already swapped.
  if exists (select 1 from public.products where is_seed and name_en = 'Koshary') then
    return;
  end if;

  delete from public.products p
  where p.is_seed
    and not exists (select 1 from public.order_items oi where oi.product_id = p.id);

  -- No longer seed, so reset_demo_data() won't bring them back.
  update public.products
  set is_seed = false, is_available = false, archived_at = coalesce(archived_at, now())
  where is_seed;

  -- Insert order sets the ids: the first 6 are the home page's featured dishes.
  insert into public.products
    (name_en, name_ar, description_en, description_ar, price, image_url, category, is_available, is_seed)
  select v.*, true, true
  from (values
    ('Koshary', 'كشري',
     'Rice, lentils, pasta and chickpeas with spicy tomato sauce, garlic vinegar and crispy onions.',
     'رز وعدس ومكرونة وحمص، مع صلصة طماطم حارة ودقة وبصل محمر مقرمش.',
     65, 'https://images.unsplash.com/photo-1775181180462-18b20da9340e?w=800&q=80&auto=format&fit=crop', 'mains'),
    ('Beef Shawarma Sandwich', 'ساندوتش شاورما لحمة',
     'Thin-sliced beef shawarma in baladi bread with tahini, onions and pickles.',
     'شاورما لحمة مقطعة رفيع في عيش بلدي مع طحينة وبصل ومخلل.',
     125, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80&auto=format&fit=crop', 'sandwiches'),
    ('Mixed Grill Platter', 'طبق مشويات مشكلة',
     'Kofta, shish tawook and lamb kebab with rice, tahini and baladi salad.',
     'كفتة وشيش طاووق وكباب ضاني مع رز وطحينة وسلطة بلدي.',
     480, 'https://images.unsplash.com/photo-1771285119318-b342c3ecc51c?w=800&q=80&auto=format&fit=crop', 'grills'),
    ('Taameya Plate', 'طبق طعمية',
     'Hot green taameya with tahini, pickles and baladi bread.',
     'طعمية خضرا سخنة مع طحينة ومخلل وعيش بلدي.',
     40, 'https://images.unsplash.com/photo-1786174045076-1cd880429ef1?w=800&q=80&auto=format&fit=crop', 'breakfast'),
    ('Kunafa with Pistachio', 'كنافة بالفستق',
     'Crispy kunafa filled with cream, topped with pistachio and syrup.',
     'كنافة مقرمشة محشية قشطة، وعليها فستق وشربات.',
     90, 'https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=800&q=80&auto=format&fit=crop', 'desserts'),
    ('Stuffed Vine Leaves', 'محشي ورق عنب',
     'Vine leaves stuffed with herbed rice, cooked in lemon and tomato.',
     'ورق عنب محشي رز بالخضرة، مطبوخ بالليمون والطماطم.',
     110, 'https://images.unsplash.com/photo-1786174045070-be6a0da3a39d?w=800&q=80&auto=format&fit=crop', 'mains'),
    ('Baladi Breakfast Platter', 'فطار بلدي مشكل',
     'Ful, taameya, salads, tahini and warm baladi bread. Serves two.',
     'فول وطعمية وسلطات وطحينة وعيش بلدي سخن، يكفي اتنين.',
     150, 'https://images.unsplash.com/photo-1786174045057-89e6449f47d9?w=800&q=80&auto=format&fit=crop', 'breakfast'),
    ('Ful Medames', 'طبق فول',
     'Slow-cooked fava beans with olive oil, cumin and lemon.',
     'فول مدمس بزيت الزيتون والكمون والليمون.',
     35, 'https://images.unsplash.com/photo-1586993966545-a56595567034?w=800&q=80&auto=format&fit=crop', 'breakfast'),
    ('Chicken Shawarma Wrap', 'ساندوتش شاورما فراخ',
     'Chicken shawarma rolled in saj bread with garlic sauce and fries.',
     'شاورما فراخ ملفوفة في عيش صاج مع ثومية وبطاطس.',
     95, 'https://images.unsplash.com/photo-1778168199427-4e839943d20f?w=800&q=80&auto=format&fit=crop', 'sandwiches'),
    ('Kofta Plate', 'طبق كفتة',
     'Charcoal-grilled kofta with rice, tahini and grilled tomatoes.',
     'كفتة على الفحم مع رز وطحينة وطماطم مشوية.',
     240, 'https://images.unsplash.com/photo-1520252729650-ddced2015543?w=800&q=80&auto=format&fit=crop', 'grills'),
    ('Fries', 'بطاطس محمرة',
     'Crispy fries with salt and spices.',
     'بطاطس مقرمشة بالملح والتوابل.',
     35, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80&auto=format&fit=crop', 'sides'),
    ('Basbousa', 'بسبوسة',
     'Semolina cake soaked in syrup, topped with almonds.',
     'بسبوسة بالسمنة البلدي والشربات، وعليها لوز.',
     45, 'https://images.unsplash.com/photo-1772469625117-412cb49042e6?w=800&q=80&auto=format&fit=crop', 'desserts'),
    ('Karkadeh', 'كركديه',
     'Chilled hibiscus drink, sweet and tangy.',
     'كركديه ساقع بطعم حلو وحامض.',
     30, 'https://images.unsplash.com/photo-1593624191635-f1a49f5eca76?w=800&q=80&auto=format&fit=crop', 'drinks'),
    ('Tea with Mint', 'شاي بالنعناع',
     'Egyptian tea served in a glass with fresh mint.',
     'شاي في كوباية مع نعناع فريش.',
     20, 'https://images.unsplash.com/photo-1555758933-42f41c02c82f?w=800&q=80&auto=format&fit=crop', 'drinks'),
    ('Sugarcane Juice', 'عصير قصب',
     'Freshly pressed sugarcane, served ice cold.',
     'قصب معصور فريش، ساقع جدًا.',
     25, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&q=80&auto=format&fit=crop', 'drinks'),
    ('Fresh Orange Juice', 'عصير برتقال فريش',
     'Freshly squeezed oranges, nothing added.',
     'برتقال معصور فريش من غير أي إضافات.',
     45, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80&auto=format&fit=crop', 'drinks')
  ) as v(name_en, name_ar, description_en, description_ar, price, image_url, category);
end;
$$;
