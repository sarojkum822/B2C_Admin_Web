import React from 'react'
// import OutletDetails from './OutletDetails'
import OutletDetails from './OutletDetails'
import AddAnOutletPartner from './AddAnOutletPartner'
import AddAnOutlet from './AddAnOutlet'
import OutletPartnerDetails from './outletPartnerDetails'
import OutletDetailsTable from './outletDetailsTable'

const outletLayout = () => {


    return (
        <>
            {/* Outlet summary */}
            <div>
              

                <OutletDetailsTable/>
                <OutletPartnerDetails/>

                {/* Add outlet partner */}
                <div className='flex justify-between p-12'>

                <AddAnOutletPartner />

                <AddAnOutlet />

                </div>

            </div>

        </>
    )
}

export default outletLayout