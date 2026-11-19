import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PerformerSearchLoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/performer/search-results', { replace: true });
    }, [navigate]);

    return null;
};

export default PerformerSearchLoadingPage;
