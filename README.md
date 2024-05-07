docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management
//Section 54
docker network create my_master_slave_mysql

docker run -d --name mysql8-master --network my_master_slave_mysql -p 8811:3306 -e MYSQL_ROOT_PASSWORD=318674 mysql:8.0

docker run -d --name mysql8-slave --network my_master_slave_mysql -p 8822:3306 -e MYSQL_ROOT_PASSWORD=318674 mysql:8.0

docker exec -it mysql8-master bash -> cat /etc/my.cnf

docker cp containerID:etc/my.cnf ./mysql/master
vi mysql/master/my.cnf
docker cp ./mysql/master/my.cnf 3389ae97b7a6:/etc

docker cp containerID:etc/my.cnf ./mysql/slave
vi mysql/slave/my.cnf
docker cp ./mysql/slave/my.cnf d23801956c53:/etc

docker restart mysql8-master

docker restart mysql8-slave

docker exec -it mysql8-master bash
mysql -uroot -p
show master status;

// write cli merge slave to master
docker inspect containerId(master) // to get IPAddress

docker exec -it mysql8-slave bash
mysql -uroot -p
CHANGE MASTER TO
MASTER_HOST = '172.21.0.3',
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='318674',
master_log_file='mysql-bin.000003',
master_log_pos=157,
master_connect_retry=60,
GET_MASTER_PUBLIC_KEY=1;
START SLAVE;
SHOW SLAVE STATUS\G;
show variables like 'server_id';
show database;
create database test default charset utf8mb4;
create table user (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL);
INSERT INTO user(username) VALUES ('chuthanh');

/59
CREATE DEFINER=`root`@`%` PROCEDURE `create_table_auto_month`()
BEGIN
-- Dùng để ghi lại tháng tiếp theo dài bao nhiêu
DECLARE nextMonth varchar(20);
-- Câu lệnh SQL dùng để ghi lại việc tạo bảng
DECLARE createTableSQL varchar(5210);
-- Sau khi thực hiện câu lệnh SQL tạo bảng, lấy số lượng bảng
DECLARE tableCount int;
-- Dùng để ghi tên bảng cần tạo
DECLARE tableName varchar(20);
-- Tiền tố được sử dụng cho bảng ghi
DECLARE table_prefix varchar(20);

-- Lấy ngày của tháng tiếp theo và gán nó cho biến nextMonth
SELECT SUBSTR(
replace(
DATE_ADD(CURDATE(), INTERVAL 1 MONTH),
'-', ''),
1, 6) INTO @nextMonth;

-- Đặt giá trị biến tiền tố bảng thành like this
set @table*prefix = 'orders*';

-- Xác định tên bảng = tiền tố bảng + tháng, tức là orders_202310, orders_202311 Định dạng này
SET @tableName = CONCAT(@table_prefix, @nextMonth);
-- Xác định câu lệnh SQL để tạo bảng
set @createTableSQL=concat("create table if not exists ",@tableName,"
(
order_id INT, -- id hoá đơn
order_date DATE NOT NULL,
total_amount DECIMAL(10, 2),
PRIMARY KEY (order_id, order_date)
)");

-- Sử dụng từ khóa PREPARE để tạo phần thân SQL được chuẩn bị sẵn sàng để thực thi
PREPARE create_stmt from @createTableSQL;
-- Sử dụng từ khóa EXECUTE để thực thi phần thân SQL đã chuẩn bị ở trên：create_stmt
EXECUTE create_stmt;
-- Giải phóng phần thân SQL đã tạo trước đó (giảm mức sử dụng bộ nhớ)
DEALLOCATE PREPARE create_stmt;

-- Sau khi thực hiện câu lệnh tạo bảng, hãy truy vấn số lượng bảng và lưu nó vào biến tableCount.
SELECT
COUNT(1) INTO @tableCount
FROM
information_schema.`TABLES`
WHERE TABLE_NAME = @tableName;

-- Kiểm tra xem bảng tương ứng đã tồn tại chưa
SELECT @tableCount 'tableCount';

END

// Create Event
SHOW EVENTS;
DROP EVENT create_table_auto_month;
-- Create event
CREATE EVENT `create_table_auto_month_event` -- tao name event
ON SCHEDULE EVERY 1 MONTH -- cronjob thuc thi moi thang mot lan
STARTS '2023-10-01 04:05:09' -- bat dau sau thoi gian nay la start
ON COMPLETION PRESERVE ENABLE -- khong xoa bo count thoi gian khi thuc hien xong
DO
CALL create_table_auto_month(); -- cau lenh create table
