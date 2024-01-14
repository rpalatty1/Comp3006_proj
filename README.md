# Comp3006 - Full Stack Proj

# Train Booking System

The task was to build an application with a server (using Node.js) and to use a database (I have used MongoDB) to store information. 

I have created a simple train booking system where users can log in (or register) and enter all the detailas for their train journey. These details will be saved onto the database where they can later view and edit details when logged in.


## Fields:
* startLocation - Origin point of their journey
* endLocation - Destination of their journey
* trainTime - Departure time ( in hh:mm )
* platformNumber - Platform number of their departing train
* carriageNumber - Carriage number if chosen (optional)
* extraNotes - Notes or reminders for the user (optional)

## Users can add bookings, edit/update bookings and delete bookings ONLY if they are logged into their account. If not logged in, they will only be able to view the bookings on the homepage.


