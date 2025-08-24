import {
	type RouteConfigEntry,
	index,
	route,
} from '@react-router/dev/routes';

// Complete routes for all pages
const routes: RouteConfigEntry[] = [
	index('./page.jsx'),
	route('account/signin', './account/signin/page.jsx'),
	route('account/signup', './account/signup/page.jsx'),
	route('account/logout', './account/logout/page.jsx'),
	route('account/pending-approval', './account/pending-approval/page.jsx'),
	route('dashboard', './dashboard/page.jsx'),
	route('dashboard/setup', './dashboard/setup/page.jsx'),
	route('admin', './admin/page.jsx'),
	route('admin/teacher-applications', './admin/teacher-applications/page.jsx'),
	route('apply-teacher', './apply-teacher/page.jsx'),
	route('*?', './__create/not-found.tsx'),
];

export default routes;
