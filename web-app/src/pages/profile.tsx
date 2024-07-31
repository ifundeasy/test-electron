import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';

const Profile: React.FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl mb-4">Profile Page</h1>
        <p>This is the profile page.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Go Back to Home
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
