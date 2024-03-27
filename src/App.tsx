import { useAuth, 
         AdminPortal, 
         useAuthActions,
         useTenantsState, 
         useLoginWithRedirect,
         useFeatureEntitlements,
         usePermissionEntitlements,
         useEntitlements,
         ContextHolder} from '@frontegg/react';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import './App.css'
import { useEffect, useState } from 'react';

function App() {
  const { user, isAuthenticated } = useAuth();
  // const user = useAuthUser();
  const loginWithRedirect = useLoginWithRedirect();
  const { switchTenant, addUserApiToken } = useAuthActions();
  const { tenants } = useTenantsState();  
  const [selectedTenant, setSelectedTenant] = useState(user?.tenantId || '');

  // Uncomment this to redirect to login automatically
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect ]);
  
  const logout = () => {
   const baseUrl = ContextHolder.getContext().baseUrl;
   window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  const Divider = () => {
    return (
      <hr style={{ borderBottom: "1px dotted lightgrey", width: "100%" }} />
    );
  };

  const createToken = () => {
    addUserApiToken({description: 'test sightfull', expires: 1})
  }

  //settings button
  const handleAdminPortalClick = () => {
    AdminPortal.show()
  }

  // switch user button
  const handleSwitchTenant =  (e: any) => {   
    const selectedIndex = e.target.selectedIndex
    setSelectedTenant(selectedIndex)
    const newTenantId = tenants[selectedIndex].tenantId
    const newTenantName = tenants[selectedIndex].name
    console.log(`\nSelected index:\t${selectedIndex}\nTenant name:\t${newTenantName}\nTenant ID:\t${newTenantId}`)
    switchTenant({ tenantId: newTenantId });
  }

  // switch user button
  const handleTokenAlert = () => {
    Swal.fire({
      title: 'User\'s Token:',
      text: user?.accessToken,
      icon: 'info',
      confirmButtonText: 'Cool',    
    })
  }

  // switch user button
  const handleJwtAlert = () => {
    interface JwtPayload {
      [key: string]: any; // Define an index signature for the properties
    }
    let userAccessToken = user?.accessToken || '';
    // Assuming jwtDecode is a function to decode the JWT token
    const decodedToken: JwtPayload = jwtDecode(userAccessToken);
    // Create an empty string to store the formatted output
    let formattedOutput = '';
    // Iterate through the decoded token object and construct the formatted string
    for (const key in decodedToken) {
      if (Object.prototype.hasOwnProperty.call(decodedToken, key)) {
        formattedOutput += `${key}: ${decodedToken[key]}\n`; // Add each key-value pair
      }
    }
    Swal.fire({
      title: 'JWT Decoded:',
      html:
      '<pre>' +
      formattedOutput +
      '</pre>',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
    console.log(userAccessToken);
  }

  const Entitlements = () => {
    const { isEntitled: isFEntitled, justification: fJust } =
      useFeatureEntitlements("premium_support");

    const { isEntitled: isPEntitled, justification: pJust } =
      usePermissionEntitlements("premium.support");
    
    const { isEntitled: isFEntitled2, justification: fJust2 } = useEntitlements({
      featureKey: "premium_support",
    });
 
    const { isEntitled: isPEntitled2, justification: pJust2 } = useEntitlements({
      permissionKey: "premium.support",
    });
  
    return (
      <>
        {isFEntitled && <div>useFeatureEntitlements - Feature - premium_support</div>}
        {isPEntitled && <div>usePermissionEntitlements - Permission - premium.support</div>}
        {isPEntitled2 && <div>useEntitlements - Permission - premium.support</div>}
        {isFEntitled2 && <div>useEntitlements - Feature - premium_support</div>}
      </>
    );
  };

  
  return (
    <div>
      <div>React - TypeScript - Hosted</div>
      <div className="App">
        { isAuthenticated ? (
        <div className='card'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img className='card-img' src={user?.profilePictureUrl || undefined} alt={user?.name} />
              <span className='card-name'>Hi {user?.name}</span>
            </div>
            <Divider />

            <select className='button' value={selectedTenant} onChange={handleSwitchTenant}>
            {tenants.map((tenant, index) => (
              <option key={index} value={tenant.tenantId}>
                {tenant.name}
              </option>
            ))}
            </select>

            <div>
              <button className='button' onClick={() => handleTokenAlert()}>View Token</button>
            </div>
            <div>
              <button className='button' onClick={() => createToken()}>Create Token</button>
            </div>
            <div>
              <button className='button' onClick={() => handleJwtAlert()}>JWT</button>
            </div>
            <div>
              <button className='button' onClick={() => handleAdminPortalClick()}>Settings</button>
            </div>
            <div>
              <button className='button' onClick={() => logout()}>Logout</button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => loginWithRedirect()}>Click me to login</button>
          </div>
        )}
      </div>
      <div>
            <Entitlements />
          </div>
    </div>
  );
}

export default App;