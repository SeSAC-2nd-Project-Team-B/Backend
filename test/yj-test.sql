show databases;
show tables;
select * from user;
desc user;

insert into user values(1,"test","abc@email.com","1234",1,20,36.5,"a.img",1000,30000,now(),now());

desc product;

select * from product;
insert into category values(1,"여성패션",8,0,1,now(),now());
insert into category values(2,"의류",8,1,2,now(),now());
insert into category values(3,"상의",8,2,3,now(),now());

drop table category;
desc category;
select * from category;

insert into product values(1,"물",1,10000,"물 팔아요",0,"판매중",now(),now());
SELECT `productId`, `productName`, `userId`, `price`, `content`, `viewCount`, 
`status`, `createdAt`, `updatedAt` FROM `Product` AS `Product` 
ORDER BY `Product`.`createdAt` DESC LIMIT 1;
select now();

select * from product order by createdAt DESC;
delete from product where productId=1;

select * from category;