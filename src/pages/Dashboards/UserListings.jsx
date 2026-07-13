import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Car, Plus, IndianRupee } from 'lucide-react';

// Mock data for initial listings
const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'Maruti Suzuki Swift VXI',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2019,
    price: 450000,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Hyundai Creta SX',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2021,
    price: 1250000,
    status: 'Pending',
  },
];

const UserListings = () => {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      id: listings.length + 1,
      ...formData,
      year: parseInt(formData.year) || 0,
      price: parseInt(formData.price) || 0,
      status: 'Active', // Default status for new mock listing
    };
    
    setListings([newListing, ...listings]);
    setFormData({ title: '', brand: '', model: '', year: '', price: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground">Manage your listed vehicles here.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              List New Vehicle
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>List a New Vehicle</CardTitle>
            <CardDescription>Fill in the details to list your vehicle on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Listing Title</label>
                  <Input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Honda City 2018 in excellent condition" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Brand</label>
                  <Input 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Honda" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Model</label>
                  <Input 
                    name="model" 
                    value={formData.model} 
                    onChange={handleInputChange} 
                    placeholder="e.g., City V MT" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Manufacturing Year</label>
                  <Input 
                    name="year" 
                    type="number" 
                    value={formData.year} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 2018" 
                    required 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Expected Price (₹)</label>
                  <Input 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 500000" 
                    required 
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((car) => (
          <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-40 bg-muted flex items-center justify-center border-b border-border">
              <Car className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-foreground line-clamp-1">{car.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  car.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {car.status}
                </span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-muted-foreground">Brand: {car.brand}</p>
                <p className="text-sm text-muted-foreground">Model: {car.model}</p>
                <p className="text-sm text-muted-foreground">Year: {car.year}</p>
              </div>
              <div className="flex items-center text-lg font-bold text-primary">
                <IndianRupee className="h-5 w-5 mr-1" />
                {car.price.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {listings.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-lg">
            <Car className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-muted-foreground">No vehicles listed yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't listed any vehicles for sale.</p>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(true)}
            >
              List your first vehicle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListings;
