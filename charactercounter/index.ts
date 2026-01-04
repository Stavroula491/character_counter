import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class charactercounter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private context: ComponentFramework.Context<IInputs>;
    private NotifyOutputChanged: () => void;
    private mainDiv: HTMLDivElement;
    private submitionDiv: HTMLDivElement;
    private sub_submitionDiv: HTMLDivElement;
    private myTextBox: HTMLTextAreaElement;
    private label: HTMLLabelElement;
    private submittedText: HTMLTextAreaElement;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this.NotifyOutputChanged = notifyOutputChanged;
        this.mainDiv = document.createElement("div");
        this.mainDiv.classList.add("maindiv");
        this.submitionDiv = document.createElement("div");
        this.submitionDiv.classList.add("submitiondiv")
        this.sub_submitionDiv = document.createElement("div");
        this.sub_submitionDiv.classList.add("sub_submitiondiv");

        // Create the textbox
        this.myTextBox = document.createElement("textarea");
        this.myTextBox.value = context.parameters.Text.raw || "";
        this.myTextBox.addEventListener("input", () => this.myTextBoxHasChanged);
        this.myTextBox.classList.add("inputs");
        //this.mainDiv.appendChild(this.myTextBox);

        // create the label to count the characters
        this.label = document.createElement("label");
        this.label.classList.add("countlabel")
        //this.mainDiv.appendChild(this.label);

        // create a button to sumbit
        const button = document.createElement("button");
        button.classList.add("submitbutton");
        button.textContent = "Submit";
        button.addEventListener("click", () => {this.buttonClick();})

        this.sub_submitionDiv.appendChild(this.myTextBox);
        this.sub_submitionDiv.appendChild(this.label);
        this.submitionDiv.appendChild(this.sub_submitionDiv);
        this.submitionDiv.appendChild(button);
        this.mainDiv.appendChild(this.submitionDiv);

        // crate a label to submit the text
        this.submittedText = document.createElement("textarea");
        this.submittedText.classList.add("inputs");
        this.submittedText.setAttribute("readonly", "true");
        this.submittedText.value = "";
        this.mainDiv.appendChild(this.submittedText);

        container.appendChild(this.mainDiv);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public myTextBoxHasChanged(){
        this.NotifyOutputChanged();
    }

    public buttonClick(){
        this.submittedText.value = this.myTextBox.value.length > 100 ? this.myTextBox.value.substring(0,100) : this.myTextBox.value;
        this.NotifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this.myTextBox.value = context.parameters.Text.raw || "";
        this.label.innerHTML = `${this.myTextBox.value.length}/100 ${this.myTextBox.value.length > 100 ? " Character limit exceeded" : ""}`
        if (this.myTextBox.value.length > 100){
            this.myTextBox.style.color = "red";
        } else {
            this.myTextBox.style.color = "black"
        }
        this.NotifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            Text : this.myTextBox.value
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
