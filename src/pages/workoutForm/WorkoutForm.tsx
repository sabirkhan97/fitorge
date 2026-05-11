import { useAuthContext } from "../../context/AuthContext";
import GuestView from "./pages/GuestView";
import UserView from "./pages/UserView";

const WorkoutForm = () => {
    const { session, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    return session ? <GuestView /> : <GuestView />;
};

export default WorkoutForm;