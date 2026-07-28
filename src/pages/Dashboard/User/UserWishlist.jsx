import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const UserWishlist = () => {
  const navigate = useNavigate();
  // In a real application, this would fetch from an API
  const wishlistItems = []; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">Vehicles you have saved for later.</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card mt-8">
          <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't added any vehicles to your wishlist yet. Explore our listings and save your favorites!
          </p>
          <Button 
            onClick={() => navigate('/#featured-vehicles')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Vehicles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wishlist items would be mapped here similar to UserListings */}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;
