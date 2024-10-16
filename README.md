# TECKY_BAD_Project


Aggregation 

- `array_agg`
- `json_agg`

```psql
SELECT products.id,products.product_name,
json_agg(json_build_object('model_id',product_option.model_id,'model_name',model.name,'color_id',product_option.color_id,'color_name',color.name,'quantity',product_option.product_quantity))
-- array_agg((product_option.model_id)),
-- array_agg(product_option.color_id),
from products 
JOIN product_option ON products.id = product_option.products_id
JOIN color on product_option.color_id = color.id
JOIN model on  product_option.model_id = model.id
WHERE products.id =9
GROUP BY products.id

```