import 'react-toastify/dist/ReactToastify.min.css';
import {ToastContainer} from "react-toastify";

export default function AuthenticatedPagesLayout({ children }) {
	return (
		<>
			<ToastContainer
				limit={1}
				autoClose={1500}
				position="top-center"
				pauseOnFocusLoss
				draggable={'touch'}
				theme="light"
			/>
			{children}
		</>
	)
}
