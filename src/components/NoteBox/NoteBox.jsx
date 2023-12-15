import React, { useEffect, useState } from "react";
import style from "./notebox.module.css";
import Img from "../../assets/default_note.png";
import { IoMdLock } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const NoteSection = ({ noteGroup, selected, setGoBacks }) => {
	const [myNote, setMyNote] = useState([]);
	const [allNotes, setAllNotes] = useState([]);
	const [textareaValue, settextareaValue] = useState("");

	useEffect(() => {
		const storedNotes = JSON.parse(localStorage.getItem(selected)) || [];
		setMyNote(storedNotes);
	}, [selected]);

	const submitNote = async (event) => {
		event.preventDefault();

		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		const today = new Date();
		const day = today.getDate();
		const month = months[today.getMonth()];
		const year = today.getFullYear();

		const formattedDate = `${day} ${month} ${year}`;

		let hours = today.getHours();
		let minutes = today.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";

		// Convert hours to 12-hour format
		hours = hours % 12;
		hours = hours ? hours : 12; // The hour '0' should be '12'

		// Add leading zero to minutes if needed
		minutes = minutes < 10 ? "0" + minutes : minutes;

		const formattedTime = `${hours}:${minutes} ${ampm}`;

		const Note = [formattedDate, formattedTime, allNotes];

		// Setting Data
        const existingGroups = JSON.parse(localStorage.getItem(selected)) || [];

		if (existingGroups.length === 0) {
			localStorage.setItem(selected, JSON.stringify([Note]));
		} else {
			localStorage.setItem(selected, JSON.stringify([...existingGroups, Note]));
		}

		// Parse the value from localStorage and set it as an array or an empty array if null
		const updatedMyNote = JSON.parse(localStorage.getItem(selected)) || [];
		setMyNote(updatedMyNote);

		setAllNotes("");
	};
	const handleGoBack = () => {
		setGoBacks(true)
	}

	return (
		<>
			<div className={style.header} style={{ backgroundColor: "#001f8b" }}>
				<i className="fas fa-arrow-left" id={style.back} onClick={() => handleGoBack()}></i>
				<div className={style.logo} style={{ backgroundColor: noteGroup[2] }}>
					{noteGroup[0]}
				</div>
				<div className={style.name}>{noteGroup[1]}</div>
			</div>
			<div className={style.allNotes}>
				{[...myNote].reverse().map((note, index) => (
					<div className={style.note} key={index}>
						{note[2]}
						<div className={style.noteTime}>
							{note[0]} <span></span> {note[1]}
						</div>
					</div>
				))}
			</div>

			<form onSubmit={submitNote} className={style.addNote}>
				<textarea
					required
					name="note"
					id="note"
					onChange={(event) => {
						setAllNotes(event.target.value);
						settextareaValue(event.target.value);
					}}
					value={allNotes}
					placeholder="Enter your note here..."
				></textarea>
				<button className="fas " 
				style={textareaValue === ""  ? { color: "grey", cursor: "not-allowed" } : { color: "blue", cursor: "pointer" }}>
				{<IoSend />}</button>
			</form>
		</>
	);
};

const NoteBox = (props) => {
	const [noteGroup, setNoteGroup] = useState(null);

	const [selected, setSelected] = useState("");

	useEffect(() => {
		// Retrieve the value from localStorage
		setSelected(props.selected);

		if (props.selected) {
			// Parse the "pocketGroup" value from localStorage
			const pocketGroups =
				JSON.parse(localStorage.getItem("pocketGroup")) || [];

			// Find the group with the matching name
			const matchingGroup = pocketGroups.find(
				(group) => group[1] === props.selected
			);
			// Set the found group in state
			setNoteGroup(matchingGroup);
		}
	}, [props.selected]);

	return (
		<div className={style.noteSection}>
			{!noteGroup ? (
				<>
					<img src={Img} alt="Pocket Notes" />
					<h2>Pocket Notes</h2>
					<p>
						Send and receive messages without keeping your phone online. Use
						Pocket Notes on up to 4 linked devices and 1 mobile phone
					</p>
					<div className={style.homeLock} >
						<IoMdLock />
						<span className={style.encryptMessage}>end-to-end encrypted</span>
					</div>
				</>
			) : (
				<NoteSection noteGroup={noteGroup} selected={selected || ""} setGoBacks={props.setBack} />
			)}
		</div>
	);
};

export default NoteBox;
