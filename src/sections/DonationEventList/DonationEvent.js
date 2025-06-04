import React from 'react'

function DonationEvent() {

    // name - location - donationDate 

    const donationEvents = [
        {
            name: "Donation Event 1",
            location: "Location 1",
            donationDate: "2021-01-01"
        },
        {
            name: "Donation Event 2",
            location: "Location 2",
            donationDate: "2021-01-02"
        },            
    ]
  return (
    <div>
        {donationEvents.map((event) => (
            <div key={event.name}>
                <h1>{event.name}</h1>
            </div>
        ))}
    </div>
  )
}

export default DonationEvent