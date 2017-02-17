module Photos.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type Msg
    = PhotoSelected Photo


type alias Photo =
    { index : Int
    , url : String
    }


type alias Model =
    { selectedPhoto : Maybe Photo
    , photos : List Photo
    }


initialModel : Model
initialModel =
    { photos = List.map createPhoto <| List.range 1 49
    , selectedPhoto = Nothing
    }


createPhoto : Int -> Photo
createPhoto photoId =
    { index = photoId
    , url = buildPhotoUrl photoId
    }


buildPhotoUrl : Int -> String
buildPhotoUrl photoId =
    "/assets/images/photos/" ++ toString photoId ++ ".jpg"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PhotoSelected photo ->
            ( { model | selectedPhoto = Just photo }, Cmd.none )


renderPhotoCol : Photo -> Html Msg
renderPhotoCol photo =
    div [ class "col col-sm-3" ]
        [ div [ class "thumbnail" ]
            [ img [ onClick <| PhotoSelected photo, src photo.url ] []
            ]
        ]


renderPhotoRows : List Photo -> List (Html Msg)
renderPhotoRows photos =
    case photos of
        [] ->
            [ span [] [] ]

        first :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                ]
            ]

        first :: second :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                ]
            ]

        first :: second :: third :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                ]
            ]

        first :: second :: third :: fourth :: rest ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                , renderPhotoCol fourth
                ]
            ]
                ++ renderPhotoRows rest


view : Model -> Html Msg
view model =
    div [ class "container" ] <| renderPhotoRows model.photos
