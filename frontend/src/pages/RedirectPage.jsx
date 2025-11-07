import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function RedirectPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const to = searchParams.get('to');

    useEffect(() => {
        if (to) {
            navigate(to, { replace: true });
        } else {
            navigate('/home', { replace: true });
        }
    }, [to, navigate]);

    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Redirecting...</div>;
}
