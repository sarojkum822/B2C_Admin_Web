import React from 'react'
// import OutletDetails from './OutletDetails'
import OutletDetails from './OutletDetails'
import AddAnOutletPartner from './AddAnOutletPartner'
import AddAnOutlet from './AddAnOutlet'
import OutletPartnerDetails from './outletPartnerDetails'

const outlet = () => {


    return (
        <>
            {/* Outlet summary */}
            <div>
                <OutletDetails />

                {/* All outlets */}
                <OutletPartnerDetails />

                {/* Add outlet partner */}
                <div className='flex justify-between p-12'>
                <AddAnOutletPartner />
                <AddAnOutlet />

                </div>
            </div>

        </>
    )
}

export default outlet