// ReportData.ts

export interface Report {
    name: string;
    drive_id: string;
    date: Date;
    creator: string;
    type: string;
}

// Function to generate a random date within the last two months
const getRandomDateLastTwoMonths = (): Date => {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    const randomTime = twoMonthsAgo.getTime() + Math.random() * (today.getTime() - twoMonthsAgo.getTime());
    return new Date(randomTime);
};

// https://drive.google.com/file/d/1fdCpfgOzz1HEpXPytUto775eKN04ue0Y/view?usp=drive_link 6
// https://drive.google.com/file/d/1REY97gVlnP_lCakwoaDEF9OmfJZro8zd/view?usp=drive_link 5
// https://drive.google.com/file/d/1ra6ItnNHaR7pFIhJWLYpZV9IzaeMFw1F/view?usp=drive_link 4
// https://drive.google.com/file/d/1OhteN8pe0zY5EmE9MCxKwa1jzknmIMkq/view?usp=drive_link 3

// Array of report data with random dates from the last two months
const reports: Report[] = [
    {
        name: "Report_1",
        drive_id: "1gUml91O7Dgu4FH6bC4Nt9em-sTa3YZcJ",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Quick Report",
    },
    {
        name: "Report_2",
        drive_id: "1BQfrZuMP8nEc2KIMDTr1KgfpLUnQB0Gf",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Custom Report",
    },
    {
        name: "Report_3",
        drive_id: "1OhteN8pe0zY5EmE9MCxKwa1jzknmIMkq",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Full Report",
    },
    {
        name: "Report_4",
        drive_id: "1ra6ItnNHaR7pFIhJWLYpZV9IzaeMFw1F",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Custom Report",
    },
    {
        name: "Report_5",
        drive_id: "1ra6ItnNHaR7pFIhJWLYpZV9IzaeMFw1F",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Quick Report",
    },
    {
        name: "Report_6",
        drive_id: "1fdCpfgOzz1HEpXPytUto775eKN04ue0Y",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Full Report",
    },
];

export default reports;
