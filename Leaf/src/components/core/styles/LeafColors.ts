import { UnreachableCaseError } from "../../../language/errors/UnreachableCaseError";
import { TriageCode } from "../../../model/triage/TriageCode";
import LeafColor from "./color/LeafColor";

/**
 * Predefined colors to be used application-wide.
 * Colors are defined with a light-mode and an optional dark-mode variant.
 * Colors should be named using light-mode convention, that is, colors should be named according to how they should be read in light mode. "Dark text" is text that is dark in light mode, and light in dark mode.
 * To select colors, I recommend the resource: https://yeun.github.io/open-color/
 */
class LeafColors {

    // Palette

    static get accent(): LeafColor {
        // TODO: Update for dark mode
        return new LeafColor("#51b962");
    }

    static get lightAccent(): LeafColor {
        // TODO: Update for dark mode
        return new LeafColor("#e0f9e1");
    }

    // Text

    static get textDark(): LeafColor {
        return new LeafColor("#212529", "#f8f9fa");
    }

    static get textSemiDark(): LeafColor {
        return new LeafColor("#4b4c4d", "#b6b8bb");
    }

    static get textLight(): LeafColor {
        return new LeafColor("#f8f9fa", "#212529");
    }

    static get textSemiLight(): LeafColor {
        return new LeafColor("#b6b8bb", "#4b4c4d");
    }

    static get textError(): LeafColor {
        // TODO: Update for dark mode
        return new LeafColor("#e03131");
    }

    // Backgrounds

    static get textBackgroundDark(): LeafColor {
        // TODO: Update for dark mode
        return new LeafColor("#ececec");
    }

    static get textBackgroundLight(): LeafColor {
        // TODO: Update for dark mode
        return new LeafColor("#ffffff");
    }

    // Triage

    public static triageCode(code: TriageCode): LeafColor {
        switch (code) {
            case TriageCode.immediate:
                return new LeafColor("#b52831");
            case TriageCode.emergency:
                return new LeafColor("#df9e40");
            case TriageCode.urgent:
                return new LeafColor("#0b8552");
            case TriageCode.semiUrgent:
                return new LeafColor("#0d548a");
            case TriageCode.nonUrgent:
                return new LeafColor("#fefff8");
            default:
                throw new UnreachableCaseError(code);
        }
    }

    public static textTriageCode(code: TriageCode): LeafColor {
        switch (code) {
            case TriageCode.immediate:
            case TriageCode.emergency:
            case TriageCode.urgent:
            case TriageCode.semiUrgent:
                return LeafColors.textLight;
            case TriageCode.nonUrgent:
                return LeafColors.textDark;
            default:
                throw new UnreachableCaseError(code);
        }
    }

}

export default LeafColors;