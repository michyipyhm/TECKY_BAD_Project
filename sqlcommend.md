with carts as (
    SELECT shopping_cart.*, 
    product_option.id as product_option_id,
    product_option.model_id as model_id,
    model.name as model_name,
    product_option.product_quantity as product_quantity,

    product_option.color_id as color_id,
    color.name as color_name,

    product_option.products_id as product_id,
    products.product_name as product_name,

    products.sub_category_id as sub_category_id,
    sub_category.category_name as sub_category_name,

    products.product_price as product_price,
    products.custom_made as custom_made

    FROM shopping_cart
    JOIN product_option ON product_option.id = shopping_cart.product_option_id
    JOIN products ON products.id = product_option.products_id
    JOIN model ON model.id = product_option.model_id
    JOIN color ON color.id = product_option.color_id
    JOIN sub_category ON sub_category.id = products.sub_category_id
    JOIN category ON category.id = sub_category.category_id
    WHERE shopping_cart.member_id = 1
),
images as (
    select product_id, json_agg(product_image.id) as product_image_ids, json_agg(product_image.image_path) as product_images from product_image group by product_id
)

select * from carts left join images on carts.product_id = images.product_id;

with images as (
    select product_id, json_agg(product_image.id) as product_image_ids, json_agg(product_image.image_path) as product_images from product_image group by product_id
)
SELECT *
FROM order_details
JOIN orders ON orders.id = order_details.order_id
JOIN products ON products.id = order_details.product_id
join images on products.id = images.product_id
WHERE orders.member_id = :userId
  AND orders.state = 'Pending';

  images as (
          select product_id, 
                 json_agg(product_image.id) as product_image_ids, 
                 json_agg(s
                   CASE 
                     WHEN product_image.image_path LIKE 'public/%' 
                     THEN substring(product_image.image_path from 8)
                     ELSE product_image.image_path 
                   END
                 ) as product_images 
          from product_image 
          group by product_id
      )
      select * from carts left join images on carts.product_id = images.product_id;`, [userId]
    )