show databases;
show tables;
select * from user;
desc user;

-- 타임존 변경
select now(),@@system_time_zone AS TimeZone;
set global time_zone = '+9:00';
set time_zone = '+9:00';

insert into user values(1,"test","abc@email.com","1234",1,20,36.5,"a.img",1000,30000,now(),now());

desc product;

insert into category values(1,"여성패션",8,0,1,now(),now());
insert into category values(2,"의류",8,1,2,now(),now());
insert into category values(3,"상의",8,2,3,now(),now());

drop table category;
desc category;
select * from category;

insert into product values(30,"물",1,10000,"물 팔아요",0,"판매중",null,now(),now());
desc likes;
select * from user;
select * from report;
select * from product;
delete from report where reportId>=1;
SELECT `productId`, `productName`, `userId`, `price`, `content`, `viewCount`, `status`, `buyerId`, `createdAt`, `updatedAt` FROM `Product` AS `Product` ORDER BY `Product`.`productId` DESC LIMIT 10, 10;
SELECT * FROM `Product` AS `Product` ORDER BY `Product`.`productId` DESC LIMIT 0, 10;

select * from product order by productId desc;

SELECT Product.productId, count(likesCount) FROM `Likes`  
LEFT OUTER JOIN `Product`  ON `Likes`.`productId` = `Product`.`productId`;

select productId, count(*) from likes group by productId;

SELECT Product.productId, Likes.productId FROM `Product` AS `Product` 
LEFT OUTER JOIN `Likes` ON `Product`.`productId` = `Likes`.`productId`;

update user set money=10000 where userId=2;
select * from likes;
desc user;
desc product;

update product set buyerId=2 where productId=3;
delete from product where productId=1;
alter table product drop column buyerId;
alter table product add column buyerId BIGINT;
alter table product add foreign key(buyerId) references user(userId);

use sesac_project_2;
drop table likes;

desc likes;
desc report;

SELECT `User`.*, `Products`.`productId` AS `Products.productId`, `Products`.`buyerId` AS `Products.buyerId`, `Products`.`price` AS `Products.price` FROM (SELECT `User`.`userId`, `User`.`money` FROM `User` AS `User` WHERE ( SELECT `buyerId` FROM `Product` AS `Products` WHERE (`Products`.`userId` = 1 AND `Products`.`buyerId` = `User`.`userId`) LIMIT 1 ) IS NOT NULL LIMIT 1) AS `User` INNER JOIN 
`Product` AS `Products` ON `User`.`userId` = `Products`.`buyerId` AND `Products`.`userId` = 1;

insert into likes values(3,8,1,0,now(),now());
update likes set likesid=1 where productId=8;

drop table category;
drop table message;
drop table room;
drop table review;
drop table report;
drop table likes;
drop table usercoupon;
drop table producthashtag;
drop table productimage;
drop table newproduct;
drop table location;

drop table coupon;
drop table active;
drop table product;
drop table user;

