import { useState } from "react";

export default function OfficeHourModal({ officeHour, onSave, onClose }) {
  const [day, setDay] = useState(officeHour?.day || "monday");

  const [startTime, setStartTime] = useState(officeHour?.start_time || "");

  const [endTime, setEndTime] = useState(officeHour?.end_time || "");

  const submit = () => {
    onSave({
      day,
      start_time: startTime,
      end_time: endTime,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-5">
          {officeHour ? "Edit Office Hour" : "Add Office Hour"}
        </h2>

        <div className="space-y-4">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-xl">
              Cancel
            </button>

            <button
              onClick={submit}
              className="
                px-4
                py-2
                rounded-xl
                bg-[#317873]
                text-white
              "
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
