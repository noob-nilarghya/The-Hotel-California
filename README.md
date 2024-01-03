
# The Hotel California

This is basically an internal website for The Hotel California employee. 

It has various features like:


## Features

- Light/dark mode toggle
- Login/Logout (Authentication features) for hotel staffs
- Dashboard with info regarding: 
    - Bookings stats (Total booking, Total Sales)
    - Guests who will Check-in/Check-out today
    - A Pie Chart showing guest's stay duration summery
    - A Line Chart showing sales in a given intervals
    - We can filter all these information on past 7,30,90 days
- List of Cabins (or hotel rooms) along with EDIT Cabins features and pagination
- Authenticated hotel staff can also add new Cabin
- List of all Bookings along with Booking Detail page and Check-in, Check-out function
- All the list are paginated and can be filtered based on Price, Booking Date, Cabin Capacity etc.
- Authenticated hotel staff can Create new user for newly joined employee
- Currently logged in staff can edit their account info (can edit Full Name, Password, and even can change their display picture)
- Hotel employee can also change Hotel Settings (info needed while bill generation)


## Installation
Clone and download this repository

Install my-project with npm

```bash
  npm install
  npm run dev
```

    
## Tech Stack

**Client:** React, Redux, Styled-Components(CSS), Recharts

**Server:** Supabase (along with react-router for global remote state management)


## Screenshots
Dashboard-dark-mode:

![Dashboard-dark-mode](https://i.ibb.co/YTPkdCv/dashboard-dark.png)

Dashboard-light-mode:

![Dashboard-light-mode](https://i.ibb.co/wJ3HtnY/dashboard-light.png)

Bookings-dark-mode:

![Bookings-dark-mode](https://i.ibb.co/SsxbQcJ/bookings-dark.png)

Cabins-dark-mode:

![Cabins-dark-mode](https://i.ibb.co/cJwTNrg/cabin-dark.png)

Booking-Details-dark-mode:

![Booking-Details-dark-mode](https://i.ibb.co/y87NbJf/booking-detail-dark.png)


## Authors

- [@noob-nilarghya](https://www.github.com/noob-nilarghya)

