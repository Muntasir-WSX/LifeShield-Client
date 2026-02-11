import axios from "axios";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
    // এখানে চাইলে পরে ইন্টারসেপ্টর (interceptors) বসিয়ে টোকেন অ্যাড করা যাবে
    return axiosSecure;
};

export default useAxiosSecure;