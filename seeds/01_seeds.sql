INSERT INTO users (name, email)
VALUES ('Jason Welles', 'jw_1993@hotmail.com'),
('Maya Kumar', 'maya.k@gmail.com'),
('Devin Jones', 'DJjones@gmail.com');

INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Skokes Cotty', 'https://myspace.com/asdkjaskdj', 'https://tinyurl.com/19FjuD', 1235, 4, 6, 5, 'Canada', '88 Slopes Rd.', 'Muskoka', 'Ontario', 'M2P 4U7'), 
(2, 'City Rat Cage', 'https://imgur.com/a90KEc8', 'https://imgur.com/kekek12', 900, 1, 1, 1, 'Canada', '420 King St. W', 'Toronto', 'Ontario', 'M1k 5J8'),
(3, 'Dingy Shack', 'https://kijiji.ca/12Ipda0', 'https:fotohost.ca/1NBd49k', 300, 3, 1, 2, 'Canada', '19 McDonald Blvd.', 'Sarnia', 'Ontario', 'N76 2G4');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (2, 1, '2017-12-24', '2017-12-30'), 
(3, 2, '2018-03-12', '2018-04-20'),
(1, 3, '2020-02-20', '2020-05-15');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating)
VALUES (2, 1, 1, 5), (3, 2, 2, 4), (1, 3, 3, 1);