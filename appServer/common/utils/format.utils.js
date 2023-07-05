const path = require("path");
const SystemConst = require("../consts/system_const");
const EnumServerDefinitions = require("../enums/enum_server_definitions");
const moment = require("moment-timezone");


class FormatUtils {
    getGVOrST(role) {
        return role === EnumServerDefinitions.ROLE.TEACHER ? 'GV' : 'SV';
    }
    checkPostsDeadline(dateString) {
        const timeZone = SystemConst.TIME_ZONE;
        const now = moment().tz(timeZone);
        const tomorrow = moment().tz(timeZone).add(1,'day');
        const exam_deadline = moment(dateString);
        return exam_deadline <= tomorrow && now < exam_deadline;
    }
    formatDateNow() {
        return moment.tz(SystemConst.TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
    }
    // check before start time
    checkBeforeStartTime(startTime) {
        const submissionDate = moment().tz(SystemConst.TIME_ZONE);
        if (submissionDate < postDetail.start_date) {
            return true;
        }
        return false;
    }
    // check dead line exceeded
    checkDeadlineExceeded(finishDate) {
        const submissionDate = moment().tz(SystemConst.TIME_ZONE);
        if (submissionDate > finishDate) {
            return true;
        }
        return false;
    }
    // format file request
    formatFileRequest(files, accountId) {
        const listFiles =  files.map(item => {
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
        return moment.tz(SystemConst.TIME_ZONE);
    }
    //format date time now
    dateTimeNowString() {
        return moment().tz(SystemConst.TIME_ZONE).format('YYYYMMDDHHmmssSSS');
    }
    //// Format post
    //format file
    formatFile(listFile) {
        return listFile.map(postFile => ({
            file_id: postFile.File.id,
            file_name: postFile.File.file_name,
            file_type: postFile.File.file_type
            // physical_name: postFile.File.physical_name,
            // file_path: postFile.File.file_path
        }));
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
            // Nếu là học sinh (role = 2)
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
            return {
                id: comment.id,
                content: comment.content,
                comment_date: comment.comment_date,
                first_name: account.first_name,
                last_name: account.last_name
            }
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
                // topic_id: post.topic_id,
                files: formattedPostFiles,
                comments: formatComments
            };
            if (post.post_category_id !== EnumServerDefinitions.POST_CATEGORY.NEWS) {
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
        //const account = this.formatAccount(postDetail.accounts);
        const studentExams = postDetail.student_exams.map(item => ({
            id: item.id,
            finish_date: item.finish_date,
            total_score: item.total_score,
            submission: item.submission,
            file: this.formatFile(item.student_file_submissions)
        }));
        const formattedPost = {
            id: post.id,
            title: post.title,
            content: post.content,
            create_date: post.create_date,
            //category: post.post_categories.category_name,
            //classroom_id: post.classroom_id,
            //last_name: account.last_name,
            //first_name: account.first_name,
            // topic_id: post.topic_id,
            files: this.formatFile(post.post_files),
            comments: formatComments,
            student_exams: studentExams
        };
        return formattedPost;
    }
}

module.exports = new FormatUtils;