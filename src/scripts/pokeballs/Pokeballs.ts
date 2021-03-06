///<reference path="Pokeball.ts"/>

class Pokeballs implements Feature {
    name = 'Pokeballs';
    saveKey = 'pokeballs';

    defaults = {
        'pokeballs': [25, 0, 0, 0],
        'alreadyCaughtSelection': GameConstants.Pokeball.None,
        'alreadyCaughtShinySelection': GameConstants.Pokeball.Pokeball,
        'notCaughtSelection': GameConstants.Pokeball.Pokeball,
        'notCaughtShinySelection': GameConstants.Pokeball.Pokeball,
    };

    public pokeballs: Pokeball[];
    private _alreadyCaughtSelection: KnockoutObservable<GameConstants.Pokeball>;
    private _alreadyCaughtShinySelection: KnockoutObservable<GameConstants.Pokeball>;
    private _notCaughtSelection: KnockoutObservable<GameConstants.Pokeball>;
    private _notCaughtShinySelection: KnockoutObservable<GameConstants.Pokeball>;

    public selectedSelection: KnockoutObservable<KnockoutObservable<GameConstants.Pokeball>>;
    public selectedTitle: KnockoutObservable<string>;

    constructor() {
        this.pokeballs = [
            new Pokeball(GameConstants.Pokeball.Pokeball, 0, 1250, 'A standard Pokéball', 25),
            new Pokeball(GameConstants.Pokeball.Greatball, 5, 1000, '+5% chance to catch'),
            new Pokeball(GameConstants.Pokeball.Ultraball, 10, 750, '+10% chance to catch'),
            new Pokeball(GameConstants.Pokeball.Masterball, 100, 500, '100% chance to catch'),
        ];
        this._alreadyCaughtSelection = ko.observable(this.defaults.alreadyCaughtSelection);
        this._alreadyCaughtShinySelection = ko.observable(this.defaults.alreadyCaughtShinySelection);
        this._notCaughtSelection = ko.observable(this.defaults.notCaughtSelection);
        this._notCaughtShinySelection = ko.observable(this.defaults.notCaughtShinySelection);
        this.selectedTitle = ko.observable('');
        this.selectedSelection = ko.observable(this._alreadyCaughtSelection);
    }

    initialize(): void {
    }

    /**
     * Checks the players preferences to see what pokéball needs to be used on the next throw.
     * Checks from the players pref to the most basic ball to see if the player has any.
     * @param id the pokemon we are trying to catch.
     * @param isShiny if the pokémon is shiny.
     * @returns {GameConstants.Pokeball} pokéball to use.
     */
    public calculatePokeballToUse(id: number, isShiny: boolean): GameConstants.Pokeball {
        const alreadyCaught = App.game.party.alreadyCaughtPokemon(id);
        const alreadyCaughtShiny = App.game.party.alreadyCaughtPokemon(id, true);
        let pref: GameConstants.Pokeball;
        // just check against alreadyCaughtShiny as this returns false when you don't have the pokemon yet.
        if (isShiny) {
            if (!alreadyCaughtShiny) {
                // if the pokemon is also not caught, use the higher selection since a notCaughtShiny is also a notCaught pokemon
                pref = !alreadyCaught ? Math.max(this.notCaughtSelection, this.notCaughtShinySelection) : this.notCaughtShinySelection;
            } else {
                // if the shiny is already caught, use the higher selection since the pokemon is also a caught pokemon
                pref = Math.max(this.alreadyCaughtSelection, this.alreadyCaughtShinySelection);
            }
        } else {
            if (!alreadyCaught) {
                pref = this.notCaughtSelection;
            } else {
                pref = this.alreadyCaughtSelection;
            }
        }

        let use: GameConstants.Pokeball = GameConstants.Pokeball.None;

        // Check which Pokeballs we have in stock that are of equal or lesser than selection
        for (let i: number = pref; i >= 0; i--) {
            if (this.pokeballs[i].quantity() > 0) {
                use = i;
                break;
            }
        }
        return use;
    }

    calculateCatchTime(ball: GameConstants.Pokeball): number {
        return this.pokeballs[ball].catchTime;
    }

    gainPokeballs(ball: GameConstants.Pokeball, amount: number): void {
        GameHelper.incrementObservable(this.pokeballs[ball].quantity, amount);
    }

    usePokeball(ball: GameConstants.Pokeball): void {
        GameHelper.incrementObservable(this.pokeballs[ball].quantity, -1);
        GameHelper.incrementObservable(App.game.statistics.pokeballsUsed[ball]);
    }

    getCatchBonus(ball: GameConstants.Pokeball): number {
        return this.pokeballs[ball].catchBonus;
    }

    getBallQuantity(ball: GameConstants.Pokeball): number {
        const pokeball = this.pokeballs[ball];
        return pokeball ? pokeball.quantity() : 0;
    }

    canAccess(): boolean {
        return true;
    }

    fromJSON(json: Record<string, any>): void {
        if (json == null) {
            return;
        }

        if (json['pokeballs'] != null) {
            json['pokeballs'].map((amt: number, type: number) => this.pokeballs[type].quantity(amt));
        }
        this.notCaughtSelection = json['notCaughtSelection'] ?? this.defaults.notCaughtSelection;
        this.notCaughtShinySelection = json['notCaughtShinySelection'] ?? this.defaults.notCaughtShinySelection;
        this.alreadyCaughtSelection = json['alreadyCaughtSelection'] ?? this.defaults.alreadyCaughtSelection;
        this.alreadyCaughtShinySelection = json['alreadyCaughtShinySelection'] ?? this.defaults.alreadyCaughtShinySelection;
    }

    toJSON(): Record<string, any> {
        return {
            'pokeballs': this.pokeballs.map(p => p.quantity()),
            'notCaughtSelection': this.notCaughtSelection,
            'notCaughtShinySelection': this.notCaughtShinySelection,
            'alreadyCaughtSelection': this.alreadyCaughtSelection,
            'alreadyCaughtShinySelection': this.alreadyCaughtShinySelection,
        };
    }

    update(delta: number): void {
        // This method intentionally left blank
    }

    // Knockout getters/setters
    get notCaughtSelection() {
        return this._notCaughtSelection();
    }

    set notCaughtSelection(ball: GameConstants.Pokeball) {
        this._notCaughtSelection(ball);
    }

    get notCaughtShinySelection() {
        return this._notCaughtShinySelection();
    }

    set notCaughtShinySelection(ball: GameConstants.Pokeball) {
        this._notCaughtShinySelection(ball);
    }

    get alreadyCaughtSelection() {
        return this._alreadyCaughtSelection();
    }

    set alreadyCaughtSelection(ball: GameConstants.Pokeball) {
        this._alreadyCaughtSelection(ball);
    }

    get alreadyCaughtShinySelection() {
        return this._alreadyCaughtShinySelection();
    }

    set alreadyCaughtShinySelection(ball: GameConstants.Pokeball) {
        this._alreadyCaughtShinySelection(ball);
    }
}
