
import { AppLayout } from '@/components/AppLayout';
import { ProfileForm } from '@/components/ProfileForm';
import AnimatedPage from '@/components/AnimatedPage';
import UserProfile from '@/components/UserProfile';

const Profile = () => {
  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-6 w-full max-w-7xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Profile
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-border/40">
            <div className="flex justify-center mb-8">
              <UserProfile />
            </div>
            <ProfileForm />
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default Profile;
