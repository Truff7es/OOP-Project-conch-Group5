interface QuestionCardProps {
    id: number
    question: string
    choices: string[]
    selectedChoice: string | null
    onSelectChoice: (choice: string) => void
    onNext: () => void
    onPrev: () => void
}

export default function QuestionCard({
    id,
    question,
    choices,
    selectedChoice,
    onSelectChoice,
    onNext,
    onPrev,
}: QuestionCardProps){
    
    
    return (
        <div className="">
            <div className="mul-choice flex gap-4 flex-col bg-lightmode-200 w-225 p-6 rounded-2xl">
                <div className="count text-l text-lightmode-500">
                    Question {id}
                </div>
                <div className="question font-bold text-xl text-lightmode-600">
                    {question}
                </div>
                <div className="list flex flex-col gap-3">
                    {choices.map((choice) => {
                        const isSelected = selectedChoice === choice;
                        return (
                            <button 
                                key={choice}
                                type="button"
                                onClick={() => onSelectChoice(choice)}
                                className={"flex items-center option_1 gap-3 p-4 w-full rounded-2xl bg-lightmode-100 cursor-pointer text-left wrap-break-word"}>
                                <div className={`flex justify-center icon w-5 h-5 shrink-0 rounded-full border-lightmode-600 transition-border duration-200 ease-in-out ${
                                    isSelected ? `border-10` : `border-2`
                                }`}></div>
                                {choice}
                            </button>
                        )
                    })}
                </div>
                <div className="btns flex flex-row justify-end gap-3">
                    <button className="btn w-26 h-10 bg-lightmode-100 text-lightmode-800 rounded-2xl cursor-pointer"
                    onClick={onPrev}>Previous</button>
                    <button className="btn w-26 h-10 bg-lightmode-400 text-lightmode-800 rounded-2xl cursor-pointer"
                    onClick={onNext}>Next</button>
                </div>
            </div>
        </div>
    )
}