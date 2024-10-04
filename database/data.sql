\c BAD012_project


INSERT INTO category (category_name, category_type)
VALUES
(1,'phoneCase','ownBrand'),
(2,'phoneCase','notOwnBrand'),
(3,'lensProtector','cameraGuard'),
(4,'lensProtector','lensGuard'),
(5,'screenProtector','ar'),
(6,'screenProtector','privacy'),
(7,'screenProtector','antiBlue'),
(8,'screenProtector','antiFingerprint');

INSERT INTO product (product_name, category_id, phone_type, color, product_price, product_quantity)
VALUES
('2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTY EYES', 7, 'iPhone16ProMax', '', 100, 100),
-- ('2.5D ANTI-BLUE FILTERING HARMFUL LIGHT FOR HEALTY EYES', 7, 'iPhone', '', 100, 100),
('2.5D ANTI-FINGERPRINT WITH NANO COATING FOR GAME PLAYER', 8, 'iPhone16ProMax', '', 100, 100),
-- ('2.5D ANTI-FINGERPRINT WITH NANO COATING FOR GAME PLAYER', 8, 'iPhone', '', 100, 100),
('2.5D ANTI-REFLECTION FOR BETTER SCREEN CLARITY & COLOR VIBRANCY', 5, 'iPhone16ProMax', '', 100, 100),
-- ('2.5D ANTI-REFLECTION FOR BETTER SCREEN CLARITY & COLOR VIBRANCY', 5, 'iPhone', '', 100, 100),
('2.5D 360 ° PRIVACY PROTECTING SCREEN PRIVATE FROM ALL SIDES', 6, 'iPhone16ProMax', '', 100, 100),
-- ('2.5D 360 ° PRIVACY PROTECTING SCREEN PRIVATE FROM ALL SIDES', 6, 'iPhone', '', 100, 100),
('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16ProMax', 'blackTitanium', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'whiteTitanium', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'naturalTitanium', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'desertTitanium', 100, 100),
('HD CAMERA GUARD FOR FULL COVERAGE', 3, 'iPhone16ProMax', '', 100, 100),
('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'black', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'white', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'pink', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'teal', 100, 100),
-- ('AR LENS GUARD WITH 99% OPTIAL LIGHT TECHNOLOGY', 4, 'iPhone16', 'ultramarine', 100, 100),
('Flying Chess Case For Iphone16ProMax', 1, 'iPhone16ProMax', '', 100, 100);

INSERT INTO product_image(product_id, image_path)
VALUES
(1,'/photos/products/antiBlue_16.jpg'),
-- ('/photos/products/antiBlue_16Plus.jpg'),
-- ('/photos/products/antiBlue_16Pro.jpg'),
-- ('/photos/products/antiBlue_16ProMax.jpg'),
-- ('/photos/products/antiBlue.jpg'),

(2,'/photos/products/antiFingerprint_16.jpg'),
-- ('/photos/products/antiFingerprint_16Plus.jpg'),
-- ('/photos/products/antiFingerprint_16Pro.jpg'),
-- ('/photos/products/antiFingerprint_16ProMax.jpg'),
-- ('/photos/products/antiFingerprint.jpg'),

(3,'/photos/products/ar_16.jpg'),
-- ('/photos/products/ar_16Plus.jpg'),
-- ('/photos/products/ar_16Pro.jpg'),
-- ('/photos/products/ar_16ProMax.jpg'),
-- ('/photos/products/ar.jpg'),

(4,'/photos/products/privacy_16.jpg'),
-- ('/photos/products/privacy_16Plus.jpg'),
-- ('/photos/products/privacy_16Pro.jpg'),
-- ('/photos/products/privacy_16ProMax.jpg'),
-- ('/photos/products/privacy.jpg'),

(5,'/photos/products/cameraIphonePro1.jpg'),
-- ('/photos/products/cameraIphonePro2.jpg'),
-- ('/photos/products/cameraIphonePro3.jpg'),
-- ('/photos/products/cameraIphonePro4.jpg'),
-- ('/photos/products/cameraIphonePro5.jpg'),
-- ('/photos/products/cameraIphonePro6.jpg'),
(6,'/photos/products/cameraIphonePro7.jpg'),

(7,'/photos/products/cameraIphone1.jpg'),
-- ('/photos/products/cameraIphone2.jpg'),
-- ('/photos/products/cameraIphone3.jpg'),
-- ('/photos/products/cameraIphone4.jpg'),
-- ('/photos/products/cameraIphone5.jpg'),

(8,'/photos/products/case13To15_1.jpg'),
-- ('/photos/products/case13To15_2.jpg'),
-- ('/photos/products/case13To16_1.jpg'),
-- ('/photos/products/case13To16_2.jpg'),
-- ('/photos/products/case13To16_3.jpg'),
-- ('/photos/products/case14To16_1.jpg'),
-- ('/photos/products/case15_1.jpg'),
-- ('/photos/products/case15_2.jpg'),
-- ('/photos/products/case15_3.jpg');












