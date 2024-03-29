const path = require("path");
const SystemConst = require("../consts/system_const");
const EnumServerDefinitions = require("../enums/enum_server_definitions");
const moment = require("moment-timezone");
const fs = require("fs");


class FormatUtils {
    getGVOrST(role) {
        return role === EnumServerDefinitions.ROLE.TEACHER ? 'GV' : 'SV';
    }
    checkPostsDeadline(dateString) {
        const now = moment().utc();
        const tomorrow = moment().utc().add(1, 'day');
        const exam_deadline = moment(dateString);
        return exam_deadline <= tomorrow && now < exam_deadline;
    }
    // formatDateNow() {
    //     return moment.utc().format('YYYY-MM-DD HH:mm:ss');
    // }
    // check before start time
    checkBeforeStartTime(startDate) {
        const dateNow = moment().utc();
        if (dateNow < startDate) {
            return true;
        }
        return false;
    }
    // check dead line exceeded
    checkDeadlineExceeded(finishDate) {
        const submissionDate = moment().utc();
        if (submissionDate > finishDate && finishDate) {
            return true;
        }
        return false;
    }
    // format file request
    formatFileRequest(files, accountId) {
        const listFiles = files.map(item => {
            // const data = fs.readFileSync(item.path);
            // const base64 = data.toString('base64');
            return {
                file_name: Buffer.from(item.originalname, 'ascii').toString('utf8'),
                physical_name: item.filename,
                file_path: path.dirname(item.path),
                file_type: item.mimetype,
                account_id: accountId,
                file_data: item.size / SystemConst.KB
            }
        }).filter(item => item !== null);
        return listFiles;
    }
    //get date time now
    dateTimeNow() {
        return moment.utc();
    }
    //format date time now
    dateTimeNowString() {
        return moment().utc().format('YYYYMMDDHHmmssSSS');
    }
    //// Format post
    //format file
    formatFile(listFile) {
       return listFile.map(postFile => {
    const { id, file_name, physical_name, file_type, file_path } = postFile.File;

    if (file_type.startsWith('image')) {
      // Đọc nội dung của tệp tin hình ảnh
      const imageData = fs.readFileSync(path.join(__dirname, '../..', file_path, physical_name));

      // Mã hóa nội dung thành Base64
      const base64Data = imageData.toString('base64');

      return {
        file_id: id,
        file_name,
        file_type,
        file_path: `data:${file_type};base64,${base64Data}`,
      };
    } else {
      return {
        file_id: id,
        file_name,
        file_type,
      };
    }
  });
    }
    //format account
    formatAccount(account) {
        if (account.role === EnumServerDefinitions.ROLE.TEACHER) {
            // Nếu là giáo viên (role = 1)
            return {
                last_name: account.Teacher.last_name,
                first_name: account.Teacher.first_name
            };
        } else {
            // Nếu là học sinh (role = 0)
            return {
                last_name: account.Student.last_name,
                first_name: account.Student.first_name
            };
        }
    }
    //format comments
    formatComments(listComments) {
        return listComments.map(comment => {
            const account = this.formatAccount(comment.Account);
            const result = {
                id: comment.id,
                content: comment.content,
                comment_date: comment.comment_date,
                first_name: account.first_name,
                last_name: account.last_name,
                account_id: comment.account_id
            }
            if (comment.Account.avatar) {
                const imageData = fs.readFileSync(path.join(__dirname, '../../', comment.Account.avatar));
                const base64Data = imageData.toString('base64');
                result.avatar = `data:image;base64,${base64Data}`
            }
            return result;
        });
    }
    //format post
    formatPost(listPost) {
        const formattedListPost = listPost.map(post => {
            // const formattedPostFiles = post.post_files.map(postFile => ({
            //     post_file_id: postFile.id,
            //     file_name: postFile.File.file_name,
            //     physical_name: postFile.File.physical_name,
            //     file_path: postFile.File.file_path
            // }));
            const formattedPostFiles = this.formatFile(post.post_files);

            // const formatComments = post.comments.map(comment => {
            //     const account = this.formatAccount(comment.Account);
            //     return {
            //         id: comment.id,
            //         content: comment.content,
            //         comment_date: comment.comment_date,
            //         first_name: account.first_name,
            //         last_name: account.last_name
            //     }
            // });
            const formatComments = this.formatComments(post.comments);
            const account = this.formatAccount(post.accounts)
            const formattedPost = {
                id: post.id,
                title: post.title,
                content: post.content,
                create_date: post.create_date,
                post_category_id: post.post_category_id,
                classroom_id: post.classroom_id,
                last_name: account.last_name,
                first_name: account.first_name,
                account_id: post.account_id,
                // topic_id: post.topic_id,
                files: formattedPostFiles,
                comments: formatComments
            };
            if (post.post_category_id !== EnumServerDefinitions.POST_CATEGORY.NEWS && post.post_details) {
                formattedPost.finish_date = post.post_details.finish_date;
            }
            return formattedPost;
        });
        return formattedListPost;
    }
    //format post detail
    formatPostDetail(postDetail) {
        // const formatComments = postDetail.comments.map(comment => {
        //     const account = this.formatAccount(comment.Account);
        //     return {
        //         id: comment.id,
        //         content: comment.content,
        //         comment_date: comment.comment_date,
        //         first_name: account.first_name,
        //         last_name: account.last_name
        //     }
        // });
        const formatComments = this.formatComments(postDetail.comments);
        const account = this.formatAccount(postDetail.accounts);
        const studentExams = postDetail.post_category_id !== EnumServerDefinitions.POST_CATEGORY.DOCUMENT ? postDetail.student_exams.map(item => ({
            id: item.id,
            finish_date: item.finish_date,
            total_score: item.total_score,
            submission: item.submission,
            first_name: item.Student.first_name,
            last_name: item.Student.last_name,
            file: this.formatFile(item.student_file_submissions)
        })) : [];
        const formattedPost = {
            id: postDetail.id,
            title: postDetail.title,
            content: postDetail.content,
            create_date: postDetail.create_date,
            start_date: postDetail.post_details.start_date,
            finish_date: postDetail.post_details.finish_date,
            post_category_id: postDetail.post_category_id,
            //classroom_id: post.classroom_id,
            last_name: account.last_name,
            first_name: account.first_name,
            // topic_id: post.topic_id,
            files: this.formatFile(postDetail.post_files),
            comments: formatComments,
            student_exams: studentExams,
        };
        return formattedPost;
    }
    randomQuestions(listQuestions, studentExam) {
        const randomQuestions = listQuestions.map((item, index) => ({
            student_exam_id: studentExam.id,
            question_id: item.id,
            order: index + 1
        }));
        return randomQuestions;
    }
    randomAnswers(listAnswers, studentExam) {
        const randomAnswers = listAnswers.flatMap(q =>
            q.answers.sort(() => Math.random() - 0.5).flatMap((a, index) => ({
                student_exam_id: studentExam.id,
                question_id: q.id,
                answer_id: a.id,
                order: index + 1
            }))
        );
        return randomAnswers;
    }
}

module.exports = new FormatUtils;