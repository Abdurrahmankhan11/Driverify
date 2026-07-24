import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/api';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Search, ChevronLeft, ChevronRight, UserCog, Mail, Phone, Eye, User } from 'lucide-react';

const AdminUserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [isActive, setIsActive] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize,
      };
      if (search) params.search = search;
      if (role !== 'ALL') params.role = role;
      if (isActive !== 'ALL') params.is_active = isActive;

      const data = await adminService.getUsers(params);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce search
    return () => clearTimeout(delayDebounce);
  }, [search, role, isActive, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="h-8 w-8 text-blue-500" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">View, filter, and manage platform users.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9 w-full"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Select value={role} onValueChange={(val) => { setRole(val); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role">
                {role === 'ALL' ? 'All Roles' : role === 'USER' ? 'User' : role === 'MIDDLEMAN' ? 'Middleman' : role === 'ADMIN' ? 'Admin' : 'Role'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="MIDDLEMAN">Middleman</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isActive} onValueChange={(val) => { setIsActive(val); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status">
                {isActive === 'ALL' ? 'All Status' : isActive === 'true' ? 'Active' : isActive === 'false' ? 'Blocked' : 'Status'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">User</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">Phone</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">Email</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">Role</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11">Joined</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground h-11 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="animate-pulse">Loading users...</div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow
                  key={u.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => navigate(`/dashboard/admin/users/${u.id}`)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3.5">
                      {/* <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'N'}
                      </div> */}
                      <User className="h-4 w-4" />
                      <div>

                        <div className="font-semibold text-foreground text-sm uppercase">{u.full_name || 'N/A'}</div>
                        {/* <div className="text-[11px] font-medium text-muted-foreground mt-0.5 uppercase">ID: {u.id.split('-')[0]}</div> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{u.phone || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-[150px]">{u.email || 'No email'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={u.role === 'ADMIN' ? 'destructive' : u.role === 'MIDDLEMAN' ? 'secondary' : 'default'} className="text-[11px] uppercase tracking-wider font-bold">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {u.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                        Blocked
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-sm font-semibold text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button variant="black" size="sm" className="h-8 text-xs " onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/admin/users/${u.id}`);
                    }}>
                      View Details

                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of <span className="font-medium">{totalCount}</span> users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <div className="text-sm font-medium px-2">Page {page} of {totalPages}</div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
