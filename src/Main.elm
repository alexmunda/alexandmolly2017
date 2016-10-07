module Main exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Debug exposing (..)


main =
    App.beginnerProgram
        { model = model
        , view = view
        , update = update
        }


type alias Model =
    { guests : List Guest
    , attending : Bool
    }


type alias Guest =
    { firstName : String
    , lastName : String
    , id : Int
    }


model : Model
model =
    Model [ Guest "" "" 1 ] True



--update


type Msg
    = FirstName Int String
    | LastName Int String
    | ToggleAttending Bool


update : Msg -> Model -> Model
update msg model =
    case msg of
        FirstName id firstName ->
            let
                updateFirstName guest =
                    if guest.id == id then
                        { guest | firstName = firstName }
                    else
                        guest
            in
                { model | guests = List.map updateFirstName model.guests }

        LastName id lastName ->
            let
                updateLastName guest =
                    if guest.id == id then
                        { guest | lastName = lastName }
                    else
                        guest
            in
                { model | guests = List.map updateLastName model.guests }

        ToggleAttending attending ->
            { model | attending = attending }



--view


view : Model -> Html Msg
view model =
    div []
        [ fieldset []
            [ radio "Attending" (ToggleAttending True)
            , radio "Not Attending" (ToggleAttending False)
            ]
        , div [] (guestList model)
        ]


guestNames : Guest -> Html Msg
guestNames guest =
    div []
        [ input [ type' "text", placeholder "First Name", onInput (FirstName guest.id) ] []
        , input [ type' "text", placeholder "Last Name", onInput (LastName guest.id) ] []
        ]


guestList : Model -> List (Html Msg)
guestList model =
    List.map guestNames model.guests


radio : String -> Msg -> Html Msg
radio value msg =
    label
        [ style [ ( "padding", "20px" ) ]
        ]
        [ input [ type' "radio", name "font-size", onClick msg ] []
        , text value
        ]
