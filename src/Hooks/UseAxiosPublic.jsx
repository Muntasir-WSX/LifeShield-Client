import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://life-shield-server.vercel.app', 
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;