<!-- npm init --> 
<!-- install framework express --> npm install express
<!-- set up --> npm install nodemon --save-dev
<!-- install log--> npm i winston
<!-- install variable config --> npm i dotenv
<!-- install package Sequelize ORM  --> npm install --save sequelize
<!-- driver mysql2--> npm i mysql2
<!-- install driver mssql --> 
<!-- install fs-->npm install fs-extra
<!-- get datetime -->npm i moment
<!-->install json web token--> npm i jsonwebtoken

<!-- create file .env --> cp .env.example .env
<!-- Configure Env file according to mysql>
<!-- create database name is "class_room">
<!-- create tables into database--> npm run migration. Nếu lỗi comment dòng 50 trong thư mục model -> answer.model
<!-- start Server-->
<!-- use --> npm start

<!--  https-->  

<!--https-->
API Layout
check token 
    headers: {
    'Authorization': 'Bearer <your_token>'
  }
Login function
    -> route: domain/api/login
    client request [GET] json: {
        "email": email,
        "password": password
    }
    server response 
        - Status 200 || 400 || 404 || 500 json: {
                "result_message": message
            }
Json initial classroom
[
    {
        "id": 1,
        "title": "bảng tin 1",
        "content": "mới",
        "create_date": null,
        "post_category_id": 1,
        "account_id": 1,
        "classroom_id": 1,
        "topic_id": null,
        "post_files": [
            {
                "id": 1,
                "file_id": 1,
                "post_id": 1,
                "status": 1,
                "create_at": null,
                "update_at": null,
                "File": {
                    "id": 1,
                    "file_name": "ấcc",
                    "physical_name": "đâsd",
                    "create_date": null,
                    "file_path": "đâsd",
                    "file_type": "png",
                    "account_id": 1,
                    "file_data": 200,
                    "status": 1,
                    "create_at": null,
                    "update_at": null
                }
            }
        ],
        "comments": [
            {
                "id": 1,
                "post_id": 1,
                "account_id": 1,
                "content": "Minh vipro",
                "comment_date": null,
                "status": 1,
                "create_at": null,
                "update_at": null,
                "Account": {
                    "id": 1,
                    "role": 1,
                    "Student": null,
                    "Teacher": {
                        "id": 1,
                        "teacher_code": "0306201050",
                        "first_name": "Dương Nhựt Minh",
                        "last_name": "Lê",
                        "date_of_birth": "2002-10-11",
                        "gender": true,
                        "phone_number": "0399313240",
                        "CCCD": "3224512421",
                        "account_id": 1,
                        "department_id": 1,
                        "address": "Bến Tre",
                        "status": 1,
                        "create_at": null,
                        "update_at": null
                    }
                }
            }
        ]
    },
    {
        "id": 2,
        "title": "bảng tin 2",
        "content": "abc",
        "create_date": null,
        "post_category_id": 1,
        "account_id": 1,
        "classroom_id": 1,
        "topic_id": null,
        "post_files": [],
        "comments": []
    }
]

//question
  Json Question And Answer

{
    "title": "Bài tập",
    "content": "nhutminhsss",
    "post_category_id": 4,
    "list_questions_and_answers": [
  {
    "content": "Đâu là thủ đô của Việt Nam?",
    "score": 10,
    "question_category_id": 1,
    "answers": [
      { "answer": "Hà Nội", "correct_answer": true},
      { "answer": "Hồ Chí Minh", "correct_answer": false},
      { "answer": "Đà Nẵng", "correct_answer": false}
    ]
  },
  {
    "content": "Ai là người đầu tiên đặt chân lên mặt trăng?",
    "score": 10,
    "question_category_id": 1,
    "answers": [
      {"answer": "Neil Armstrong", "correct_answer": true},
      { "answer": "Buzz Aldrin", "correct_answer": false},
      { "answer": "Michael Collins", "correct_answer": false}
    ]
  },
  {
    "content": "Tình yêu là gì?",
    "score": 10,
    "question_category_id": 1,
    "answers": [
      { "answer": "Một cảm giác mạnh mẽ và tình cảm sâu sắc dành cho người khác", "correct_answer": true},
      { "answer": "Một loại bệnh", "correct_answer": false},
      { "answer": "Một trạng thái của tâm hồn", "correct_answer": true},
      { "answer": "Sự hợp tác và chia sẻ giữa hai người", "correct_answer": false}
    ]
  },
  {
    "content": "Tình yêu có thể đến bất ngờ ở đâu?",
    "score": 10,
    "question_category_id": 1,
    "answers": [
      {"answer": "Trong một buổi hẹn đầu tiên", "correct_answer": false},
      {"answer": "Ở nơi làm việc", "correct_answer": true},
      { "answer": "Trên mạng xã hội", "correct_answer": true},
      { "answer": "Chỉ trong tiểu thuyết và phim ảnh", "correct_answer": false}
    ]
  },
  {
    "content": "Tình yêu có thể tồn tại trong thời gian dài không?",
    "score": 10,
    "question_category_id": 3
  }]
}