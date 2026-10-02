# Backend Restart Required

The priority sorting fix has been applied to `backend/src/services/taskService.js`.

**The backend server must be restarted for the changes to take effect.**

## To restart the backend:

1. Stop the current backend process (Ctrl+C in the terminal running it)
2. Restart with: `cd backend && npm start`

OR if using nodemon:
```bash
cd backend && npm run dev
```

## After restarting, the priority sorting will work correctly:

- **ASC**: low → medium → high (semantic order)
- **DESC**: high → medium → low (semantic order)

The fix uses a SQL CASE expression:
```sql
ORDER BY CASE priority 
  WHEN 'low' THEN 1 
  WHEN 'medium' THEN 2 
  WHEN 'high' THEN 3 
END ASC/DESC
```

This ensures priorities are ordered semantically rather than alphabetically.
