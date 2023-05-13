import { LeafFontFamily } from "./typography/LeafFontFamily";
import LeafTypographyConfig from "./typography/LeafTypographyConfig";
import LeafColors from "./LeafColors";
import { LeafFontWeight } from "./typography/LeafFontWeight";
import LeafColor from "./color/LeafColor";

class LeafTypography {

    static get display(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            70,
            LeafFontFamily.gilroy,
            LeafColors.textBlack,
            LeafFontWeight.black,
        );
    }

    static get header(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            40,
            LeafFontFamily.circular,
            LeafColors.textDark,
            LeafFontWeight.black,
            false,
            false,
            false,
            -0.5
        );
    }

    static get cardTitle(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            20,
            LeafFontFamily.poppins,
            LeafColors.textDark,
            LeafFontWeight.semiBold,
        );
    }

    static get formCardTitle(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            16,
            LeafFontFamily.poppins,
            LeafColors.textDark,
            LeafFontWeight.bold,
        );
    }

    static get body(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            15,
            LeafFontFamily.poppins,
            LeafColors.textDark,
        );
    }

    static get subscript(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            13,
            LeafFontFamily.poppins,
            LeafColors.textSemiDark,
        );
    }

    static get badge(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            18,
            LeafFontFamily.poppins,
            undefined,
            LeafFontWeight.bold,
        );
    }

    static get primaryButton(): LeafTypographyConfig {
        return new LeafTypographyConfig(
            18,
            LeafFontFamily.poppins,
            LeafColors.textLight,
            LeafFontWeight.bold,
        );
    }

}

export default LeafTypography;