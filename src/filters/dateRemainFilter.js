import moment from "moment";

export default value => {
    return moment(value).fromNow();
};