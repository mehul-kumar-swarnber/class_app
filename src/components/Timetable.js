import { Calendar, Clock, MapPin, BookOpen, Cpu, Network, Leaf, Image, Laptop, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

// Map subject names to Lucide icons for 5th semester CSE
const subjectIcons = {
	'MP': <Cpu className="h-5 w-5 text-blue-600" />, // Microprocessors
	'MP(T)': <Cpu className="h-5 w-5 text-blue-400" />,
	'MP LAB': <Cpu className="h-5 w-5 text-blue-300" />,
	'CN': <Network className="h-5 w-5 text-green-600" />, // Computer Networks
	'CN(T)': <Network className="h-5 w-5 text-green-400" />,
	'CN LAB': <Network className="h-5 w-5 text-green-300" />,
	'FLAT': <BookOpen className="h-5 w-5 text-purple-600" />, // Formal Languages and Automata Theory
	'FLAT(T)': <BookOpen className="h-5 w-5 text-purple-400" />,
	'PYTHON': <Laptop className="h-5 w-5 text-orange-500" />, // Data Analytics with Python
	'PYTHON(T)': <Laptop className="h-5 w-5 text-orange-400" />,
	'PYTHON LAB': <Laptop className="h-5 w-5 text-orange-300" />,
	'PROJECT LAB': <BookOpen className="h-5 w-5 text-pink-400" />,
	'ES': <Leaf className="h-5 w-5 text-lime-600" />, // Environmental Science
	'DIP': <Image className="h-5 w-5 text-cyan-600" />, // Digital Image Processing (if present)
	'LIBRARY': <BookOpen className="h-5 w-5 text-gray-500" />,
	'Lunch': <UtensilsCrossed className="h-5 w-5 text-yellow-500" />,
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



// Import missing Lucide icons

const Timetable = () => {
	const [viewMode, setViewMode] = useState('weekly');
	const [currentDate, setCurrentDate] = useState(new Date());


	return (
		<div className="p-4 space-y-6 max-w-screen overflow-x-hidden pb-24">
			{/* Header */}
			<div className="text-center py-2">
				<h1 className="text-2xl mb-2 flex items-center justify-center gap-2">
					<Calendar className="h-6 w-6" />
					Class Schedule
				</h1>
				<p className="text-muted-foreground">Your weekly timetable</p>
			</div>

			{/* View Toggle */}
			<div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
				<button
					className={`flex-1 ${viewMode === 'weekly' ? 'bg-blue-500 text-white' : ''}`}
					onClick={() => setViewMode('weekly')}
				>
					Weekly View
				</button>
				<button
					className={`flex-1 ${viewMode === 'daily' ? 'bg-blue-500 text-white' : ''}`}
					onClick={() => setViewMode('daily')}
				>
					Daily View
				</button>
			</div>

			{viewMode === 'weekly' ? (
				<div className="flex justify-center my-4">
					<img
						src={process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/uploads/TT.jpg` : '/uploads/TT.jpg'}
						alt="Weekly Timetable"
						className="max-w-full rounded-lg shadow-md border"
						style={{ maxHeight: 400 }}
					/>
				</div>
			) : (
				<div className="space-y-4">
					{/* Day Picker - horizontal scroll on mobile */}
					<div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide sm:justify-center px-3 py-2 touch-pan-x" style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100vw' }}>
						{days.map(day => (
							<button
								key={day}
								className={`inline-flex items-center justify-center px-3 py-1 rounded whitespace-nowrap shrink-0 text-xs sm:text-sm ${day === currentDate.toLocaleDateString('en-US', { weekday: 'long' }) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
								style={{ minWidth: 80, maxWidth: 120 }}
								onClick={() => {
									// Set currentDate to the next occurrence of this day
									const now = new Date();
									const targetDay = days.indexOf(day);
									const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday=0
									const diff = (targetDay - todayIdx + 7) % 7;
									const newDate = new Date(now);
									newDate.setDate(now.getDate() + diff);
									setCurrentDate(newDate);
								}}
							>
								{day}
							</button>
						))}
					</div>
					{/* Daily Schedule with hardcoded dummy classes */}
					<div className="rounded-lg overflow-x-auto bg-gray-100 shadow-sm" style={{ maxWidth: '100vw' }}>
						<div className="p-3 flex flex-col sm:flex-row items-center gap-2 w-full">
							<Clock className="h-5 w-5" />
							<span className="text-center w-full sm:w-auto truncate">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}'s Schedule</span>
						</div>
						<div className="space-y-3 px-1 sm:px-3 pb-3">
							{(() => {
								const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
								const scheduleByDay = {
									Monday: [
										{ name: 'FLAT', time: '10:30AM-11:30AM' },
										{ name: 'LIBRARY', time: '11:30AM-12:30PM' },
										{ name: 'MP(T)/CN(T)', time: '12:30PM-1:30PM' },
										{ name: 'MP', time: '1:30PM-2:00PM' },
										{ name: 'DIP', time: '2:00PM-3:00PM' },
										{ name: 'PYTHON(T)/FLAT(T)', time: '3:00PM-4:00PM' },
										{ name: 'PYTHON(T)/FLAT(T)', time: '4:00PM-5:00PM' },
									],
									Tuesday: [
										{ name: 'MP', time: '10:30AM-11:30AM' },
										{ name: 'MP', time: '11:30AM-12:30PM' },
										{ name: 'FLAT', time: '12:30PM-1:30PM' },
										{ name: 'Lunch', time: '1:30PM-2:00PM' },
										{ name: 'PYTHON', time: '2:00PM-3:00PM' },
										{ name: 'PYTHON LAB/PROJECT LAB', time: '3:00PM-4:00PM' },
										{ name: 'PYTHON LAB/PROJECT LAB', time: '4:00PM-5:00PM' },
									],
									Wednesday: [
										{ name: 'PYTHON', time: '10:30AM-11:30AM' },
										{ name: 'PYTHON LAB/PROJECT LAB', time: '11:30AM-12:30PM' },
										{ name: 'PYTHON LAB/PROJECT LAB', time: '12:30PM-1:30PM' },
										{ name: 'Lunch', time: '1:30PM-2:00PM' },
										{ name: 'DIP', time: '2:00PM-3:00PM' },
										{ name: 'FLAT', time: '3:00PM-4:00PM' },
										{ name: 'ES', time: '4:00PM-5:00PM' },
									],
									Thursday: [
										{ name: 'PYTHON', time: '10:30AM-11:30AM' },
										{ name: 'DIP', time: '11:30AM-12:30PM' },
										{ name: 'CN', time: '12:30PM-1:30PM' },
										{ name: 'Lunch', time: '1:30PM-2:00PM' },
										{ name: 'CN', time: '2:00PM-3:00PM' },
										{ name: 'MP LAB/CN LAB', time: '3:00PM-4:00PM' },
										{ name: 'MP LAB/CN LAB', time: '4:00PM-5:00PM' },
									],
									Friday: [
										{ name: 'MP', time: '10:30AM-11:30AM' },
										{ name: 'PYTHON', time: '11:30AM-12:30PM' },
										{ name: 'PYTHON(T)/FLAT(T)', time: '12:30PM-1:30PM' },
										{ name: 'Lunch', time: '1:30PM-2:00PM' },
										{ name: 'CN', time: '2:00PM-3:00PM' },
										{ name: 'CN LAB/MP LAB', time: '3:00PM-4:00PM' },
										{ name: 'CN LAB/MP LAB', time: '4:00PM-5:00PM' },
									],
									Saturday: [
										{ name: 'CN', time: '10:30AM-11:30AM' },
										{ name: 'CN(T)/MP(T)', time: '11:30AM-12:30PM' },
										{ name: 'DIP', time: '12:30PM-1:30PM'}
									],
								};
								const todaySchedule = scheduleByDay[day] || [];
											   return todaySchedule.map((cls, idx) => (
												   <div
													   key={idx}
													   className="flex items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-lg bg-white border border-gray-200 shadow-sm w-full"
												   >
													   {/* Icon and Time */}
													   <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
														   <span className="mb-1">{subjectIcons[cls.name] || <BookOpen className="h-5 w-5 text-gray-400" />}</span>
														   <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{cls.time}</span>
													   </div>
													   {/* Subject and Room */}
													   <div className="flex flex-col flex-1 min-w-0">
														   <span className="font-medium text-base truncate">{cls.name}</span>
														   {cls.name !== 'Lunch' && (
															   <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
																   <MapPin className="h-4 w-4" />
																   Room 305
															   </span>
														   )}
													   </div>
												   </div>
											   ));
							})()}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};


export default Timetable;
