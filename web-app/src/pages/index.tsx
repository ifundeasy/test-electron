import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Layout from '../components/layout';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { access_token } = router.query;
      if (access_token) {
        setAccessToken(access_token as string);
      }
    }
  }, [router.isReady, router.query]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (host: string, clientId: string) => {
    const url = `${host}?client_id=${clientId}&redirect_app=http://localhost:3000`;
    window.open(url, '_blank');
    handleCloseModal();
  };

  const handleLoginViaBrowser = () => {
    handleOpenModal();
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl mb-4">Home Page</h1>
        {accessToken && <p>Access Token: {accessToken}</p>}
        {!accessToken && (
          <button onClick={handleLoginViaBrowser} className="bg-blue-500 text-white py-2 px-4 rounded">
            Login
          </button>
        )}
        {accessToken && (
          <button
            onClick={() => router.push('/profile')}
            className="bg-green-500 text-white py-2 px-4 rounded ml-4"
          >
            Go to My Profile
          </button>
        )}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default Home;
