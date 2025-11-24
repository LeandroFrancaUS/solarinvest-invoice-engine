import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import UploadInvoicePage from '../pages/UploadInvoicePage';
import ExtractPreviewPage from '../pages/ExtractPreviewPage';
import InterpretationPage from '../pages/InterpretationPage';
import CalculationPage from '../pages/CalculationPage';
import SolarInvestBillPage from '../pages/SolarInvestBillPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'upload', element: <UploadInvoicePage /> },
      { path: 'dados-extraidos', element: <ExtractPreviewPage /> },
      { path: 'interpretacao', element: <InterpretationPage /> },
      { path: 'calculo', element: <CalculationPage /> },
      { path: 'fatura-solarinvest', element: <SolarInvestBillPage /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
