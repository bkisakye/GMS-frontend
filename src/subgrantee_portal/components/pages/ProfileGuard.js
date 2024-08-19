import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../../utils/helpers';

const ProfileGuard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetchWithAuth('/api/subgrantees/profiles/me/');
        if (response.status === 200) {
          const profileData = await response.json();
          setProfile(profileData);
          navigate(`/profile/edit/${profileData.id}`);
        } else {
          navigate('/profile/create');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/profile/create');
      }
    };

    checkProfile();
  }, [navigate]);

  return null; // This component does not render anything
};

export default ProfileGuard;
