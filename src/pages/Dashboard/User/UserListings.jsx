import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Car, Plus, IndianRupee, Loader2, Eye, Edit, X, Save } from 'lucide-react';
import { vehicleService } from '../../../services/api';
import { Input } from '../../../components/ui/input';

const UserListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', description: '', kilometers_driven: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const data = await vehicleService.getMyListings();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch user listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return price;
    return val.toLocaleString('en-IN');
  };

  const handleEditClick = (car) => {
    setEditingVehicle(car);
    setEditForm({
      price: car.price || '',
      description: car.description || '',
      kilometers_driven: car.kilometers_driven || ''
    });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = {
        price: parseFloat(editForm.price),
        description: editForm.description,
        kilometers_driven: parseInt(editForm.kilometers_driven, 10)
      };
      const updated = await vehicleService.updateMyListing(editingVehicle.id, payload);
      setListings(listings.map(l => l.id === updated.id ? updated : l));
      setEditingVehicle(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update listing.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground">Manage your listed vehicles here.</p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/user/post-vehicle')} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          List New Vehicle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((car) => {
            const displayImage = car.images?.[0]?.image_url;
            return (
              <Card 
                key={car.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="h-48 bg-muted flex items-center justify-center border-b border-border overflow-hidden relative shrink-0">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Car className="h-16 w-16 text-muted-foreground/50" />
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {car.brand} {car.model} {car.variant}
                    </h3>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider shrink-0 ${
                      car.status === 'ACTIVE' || car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {car.status || 'Pending'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 mb-4 text-sm text-muted-foreground">
                    <p>Year: <span className="font-medium text-foreground">{car.year}</span></p>
                    <p>Driven: <span className="font-medium text-foreground">{car.kilometers_driven?.toLocaleString('en-IN') || 'N/A'} km</span></p>
                    <p>Fuel: <span className="font-medium text-foreground">{car.fuel_type}</span></p>
                    <p>Trans: <span className="font-medium text-foreground">{car.transmission}</span></p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center text-xl font-bold text-primary border-t border-border pt-4">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatPrice(car.price)}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="outline" className="flex-1 text-xs sm:text-sm" onClick={() => navigate(`/dashboard/user/listings/${car.id}`)}>
                        {/* <Eye className="w-4 h-4 mr-1.5" />  */}
                        View
                      </Button>
                      {/* <Button className="flex-1 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleEditClick(car)}>
                        <Edit className="w-4 h-4 mr-1.5" /> Edit
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {listings.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card">
              <Car className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-1">No vehicles listed yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">You haven't listed any vehicles for sale. Post your first vehicle to reach thousands of potential buyers.</p>
              <Button 
                onClick={() => navigate('/dashboard/user/post-vehicle')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                List your first vehicle
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
              <h2 className="text-lg font-bold text-foreground">Edit Listing</h2>
              <button onClick={() => setEditingVehicle(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price (₹)</label>
                <Input 
                  type="number" 
                  value={editForm.price} 
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})} 
                  placeholder="e.g. 650000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kilometers Driven</label>
                <Input 
                  type="number" 
                  value={editForm.kilometers_driven} 
                  onChange={(e) => setEditForm({...editForm, kilometers_driven: e.target.value})} 
                  placeholder="e.g. 15000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea 
                  className="w-full min-h-[100px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  placeholder="Add details about the vehicle..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-muted/50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingVehicle(null)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={updating}>
                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListings;
