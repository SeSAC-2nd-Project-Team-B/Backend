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

insert into category values(1,"여성패션",0,1,now(),now());
insert into category values(2,"의류",1,2,now(),now());
insert into category values(3,"상의",2,3,now(),now());

drop table category;
desc category;
desc product;
desc location;
desc user;
select count(*) from category;

select * from category order by categoryId desc;
select * from category where categoryName='패션잡화';
select * from product;
delete  from category where categoryId>=760;
delete  from product where productId>=1;

desc category;
insert into product values(1,"물",3,100,"물 팔아요",0,"판매중",null,now(),now());
desc likes;
select * from user;
select * from location;
select * from active;
select * from likes;
update active set isActive=0 where userId=4;
select * from report;
drop table productImage;
select * from productImage order by imageId desc;
desc productImage;
select * from product order by productId desc;
select * from category;
delete from report where reportId>=1;

SELECT * FROM `Product` AS `Product` ORDER BY `Product`.`productId` DESC LIMIT 0, 10;

SELECT * FROM `Likes` AS `Likes` INNER JOIN `Product` AS `Product` 
ON `Likes`.`productId` = `Product`.`productId` AND `Product`.`userId` = 2;


SELECT `ProductImage`.* FROM (SELECT * FROM (SELECT `imageId`, `productImage`, `productId` FROM `ProductImage` AS `ProductImage` WHERE `ProductImage`.`productId` = 5 LIMIT 1) AS sub UNION ALL SELECT * FROM (SELECT `imageId`, `productImage`, `productId` FROM `ProductImage` AS `ProductImage` WHERE `ProductImage`.`productId` = 1 LIMIT 1) AS sub) AS `ProductImage`;

select * from product order by productId desc;
select * from user;
select * from likes;
select * from category;

select * from productImage;

SELECT `User`.*, `Products`.`buyerId` AS `Products.buyerId`, `Products`.`price` AS `Products.price` FROM (SELECT `User`.`userId`, `User`.`nickname`, `User`.`email`, `User`.`password`, `User`.`gender`, `User`.`age`, `User`.`temp`, `User`.`profile_image`, `User`.`money`, `User`.`point`, `User`.`createdAt`, `User`.`updatedAt` FROM `User` AS `User` WHERE ( SELECT `buyerId` FROM `Product` AS `Products` WHERE (`Products`.`buyerId` = 3 AND `Products`.`buyerId` = `User`.`userId`) LIMIT 1 ) IS NOT NULL LIMIT 1) AS `User` INNER JOIN `Product` AS `Products` ON `User`.`userId` = `Products`.`buyerId` AND `Products`.`buyerId` = 3;

SELECT `Product`.`productId`, `Product`.`productName`, `Product`.`userId`, `Product`.`price`, `Product`.`content`, `Product`.`categoryId`, `Product`.`viewCount`, `Product`.`status`, `Product`.`buyerId`, `Product`.`createdAt`, `Product`.`updatedAt`, `User`.`userId` AS `User.userId` FROM `Product` AS `Product` INNER JOIN `User` AS `User` ON `Product`.`userId` = `User`.`userId` AND `User`.`nickname` = '1' WHERE `Product`.`userId` IS NOT NULL;

SELECT * FROM `Product` 
INNER JOIN `Likes` AS `Like` 
ON `Product`.`productId` = `Like`.`productId` AND `Like`.`productId` IS NOT NULL 
WHERE `Product`.`productId` IN (SELECT productId FROM Likes) AND `Product`.`userId` = 3;

update user set money=100000 where userId=2;
select * from likes;
select * from user;
desc user;
desc product;

update product set buyerId=2 where productId=3;
delete from product where productId=1;

alter table product drop column buyerId;

alter table user add column profileImage char;

alter table product add foreign key(buyerId) references user(userId);



use sesac_project_2;
drop table likes;

desc likes;
desc report;

SELECT `User`.*, `Products`.`productId` AS `Products.productId`, `Products`.`buyerId` AS `Products.buyerId`, `Products`.`price` AS `Products.price` FROM (SELECT `User`.`userId`, `User`.`money` FROM `User` AS `User` WHERE ( SELECT `buyerId` FROM `Product` AS `Products` WHERE (`Products`.`userId` = 1 AND `Products`.`buyerId` = `User`.`userId`) LIMIT 1 ) IS NOT NULL LIMIT 1) AS `User` INNER JOIN 
`Product` AS `Products` ON `User`.`userId` = `Products`.`buyerId` AND `Products`.`userId` = 1;

insert into likes values(3,8,1,0,now(),now());

insert into productImage values(1,1,'1-1.png',now(),now());
insert into productImage values(2,1,'1-2.png',now(),now());

insert into productImage values(3,2,'2-1.png',now(),now());
insert into productImage values(4,2,'2-2.png',now(),now());
insert into productImage values(5,3,'3-1.png',now(),now());
insert into productImage values(6,3,'3-2.png',now(),now());


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
drop table category;
drop table user;

desc product;

show tables;
