import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/'); // Redirect to login if not valid
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
                navigate('/'); // Redirect on error
            });
        } else {
            navigate('/'); // Redirect if no token found
        }
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Replace with actual loading component
    }

    // Render protected content if authenticated
    if (isAuthenticated) {
        return children; 
    }

    return null; // No access, render nothing (will redirect in useEffect)
};

export default ProtectedRoute;
