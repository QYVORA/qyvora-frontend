// /cyber-points redirects to /chain — the combined CP + Chain page
import { Navigate } from 'react-router-dom';
const CyberPointsPage = () => <Navigate to="/chain" replace />;
export default CyberPointsPage;
