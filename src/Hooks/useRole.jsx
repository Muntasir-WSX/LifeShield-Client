import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./UseAxiosPublic";


const useRole = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: userRole, isLoading: isRoleLoading } = useQuery({
        queryKey: [user?.email, 'userRole'],
        enabled: !loading && !!user?.email, 
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/role/${user?.email}`);
            return res.data?.role; 
        }
    });

    return [userRole, isRoleLoading];
};

export default useRole;