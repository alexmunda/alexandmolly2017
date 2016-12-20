module Countdown.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Time exposing (..)
import Date exposing (..)
import Date.Extra.Duration exposing (..)


main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type Msg
    = Tick Time


type alias Model =
    { weddingDate : Date
    , countdown : DeltaRecord
    }


initialModel : Model
initialModel =
    { weddingDate = initialWeddingDate "2017-10-28"
    , countdown = zeroDelta
    }


initialWeddingDate : String -> Date
initialWeddingDate dateString =
    Date.fromString dateString |> Result.withDefault (Date.fromTime 0)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick time ->
            ( model |> updateCountdown time, Cmd.none )


updateCountdown : Time -> Model -> Model
updateCountdown now model =
    let
        dateDiff =
            diff model.weddingDate (Date.fromTime now)
    in
        { model | countdown = dateDiff }


countdownCol : String -> Html Msg
countdownCol countdown =
    div [ class "col-sm-4" ]
        [ h2 []
            [ text countdown ]
        ]


labelCol : String -> Html Msg
labelCol label =
    div [ class "col-sm-4" ]
        [ text label
        ]


renderCountdown : Model -> Html Msg
renderCountdown model =
    let
        countdown =
            model.countdown
    in
        div [ class "countdown container" ]
            [ div [ class "row" ]
                [ div [ class "col-sm-4 col-sm-offset-4" ]
                    [ h1 [] [ text "10/28/2017" ]
                    ]
                ]
            , div [ class "row" ]
                [ countdownCol <| toString countdown.month
                , countdownCol <| toString countdown.day
                , countdownCol <| toString countdown.hour
                ]
            , div [ class "row" ]
                [ labelCol "Months"
                , labelCol "Days"
                , labelCol "Hours"
                ]
            ]


view : Model -> Html Msg
view model =
    renderCountdown model


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch [ Time.every Time.second Tick ]
