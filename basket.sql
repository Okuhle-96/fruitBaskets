create table basket ( 
  id serial not null primary key,
  fruit_name text, 
  quantity int, 
  price decimal (10,2)
);

insert into basket (fruit_name, quantity, price) values ('Apple', 1, '3.00');
insert into basket (fruit_name, quantity, price) values ('Banana', 1, '2.00');
insert into basket (fruit_name, quantity, price) values ('Orange', 1, '4.00');