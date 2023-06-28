
class CheckStringUtils {
    static SEMESTER = ['1', '2', '3', '4', '5', '6', 'Học kỳ phụ'];
    checkSemester(semester) {
        return CheckStringUtils.SEMESTER.includes(semester) ? true : false;
    }
}

module.exports = new CheckStringUtils;